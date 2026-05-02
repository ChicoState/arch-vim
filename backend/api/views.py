from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProgress


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already taken'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email
        )
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        })



@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_level(request):
    progress, _ = UserProgress.objects.get_or_create(user=request.user)
    progress.data = request.data
    progress.save()
    return Response({'status': 'saved'})

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator


class Level(models.Model):
    title = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="created_levels")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class User_Level(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name="configurations")
    min_accuracy = models.FloatField(validators=[MaxValueValidator(100)])
    max_keystrokes = models.IntegerField(blank=True, null=True)
    max_time = models.FloatField(
        blank=True, null=True,
        help_text="Max time in seconds to earn the timing star"
    )
    stars = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(3)]
    )
    is_active = models.IntegerField(
        default=1,
        blank=True,
        null=True,
        help_text="1->Active, 0->Inactive",
        choices=((1, "Active"), (0, "Inactive")),
        verbose_name="Set active?"
    )

    def __str__(self):
        return f"Config for Level {self.level_id} (min_accuracy={self.min_accuracy})"


class UserLevelInstance(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="level_attempts"
    )
    level = models.ForeignKey(
        Level,
        on_delete=models.CASCADE,
        related_name="user_instances"
    )
    max_time = models.FloatField(
        blank=True, null=True,
        help_text="Time taken (seconds) to complete the level"
    )
    stroke_count = models.IntegerField(
        blank=True, null=True,
        help_text="Number of keystrokes used during the attempt"
    )
    accuracy = models.FloatField(
        blank=True, null=True,
        help_text="Accuracy percentage (0–100) submitted by the frontend"
    )
    completed = models.BooleanField(default=False)
    stars_earned = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(3)],
        help_text="0=not completed, 1=completed, 2=+accuracy, 3=+accuracy & time"
    )
    attempted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-stars_earned", "-attempted_at"]

    def __str__(self):
        return (
            f"{self.user.username} → Level {self.level_id} | "
            f"{'✓' if self.completed else '✗'} | ⭐{self.stars_earned}"
        )

from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Level, User_Level, UserLevelInstance


@method_decorator(csrf_exempt, name="dispatch")
class StarView(LoginRequiredMixin, View):
    """
    GET  /api/stars/<level_id>/  → return the user's best attempt for that level
    POST /api/stars/<level_id>/  → receive frontend performance data, compute stars,
                                   save UserLevelInstance, return result
    """

    def _compute_stars(self, config: User_Level, completed: bool, accuracy: float, time_taken: float) -> int:
        """
        Star logic:
          0 → not completed
          1 → completed
          2 → completed + accuracy met
          3 → completed + accuracy met + time met
        """
        if not completed:
            return 0

        accuracy_met = (accuracy is not None) and (accuracy >= config.min_accuracy)
        time_met = (
            config.max_time is not None
            and time_taken is not None
            and time_taken <= config.max_time
        )

        if accuracy_met and time_met:
            return 3
        if accuracy_met:
            return 2
        return 1

    def get(self, request, level_id):
        """Return the user's best existing attempt for a level.


        Expects JSON body:
        {
            "completed":    true,
            "accuracy":     92.5,
            "time_taken":   45.3,
            "stroke_count": 134
        }
        """
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        completed    = bool(body.get("completed", False))
        accuracy     = body.get("accuracy")
        time_taken   = body.get("time_taken")
        stroke_count = body.get("stroke_count")


        config = (
            User_Level.objects
            .filter(level_id=level_id, is_active=1)
            .first()
        )
        if not config:
            return JsonResponse({"error": "No active config found for this level"}, status=404)

        stars = self._compute_stars(config, completed, accuracy, time_taken)


        existing = (
            UserLevelInstance.objects
            .filter(user=request.user, level_id=level_id)
            .order_by("-stars_earned")
            .first()
        )
        if not existing or stars >= existing.stars_earned:
            UserLevelInstance.objects.update_or_create(
                user=request.user,
                level_id=level_id,
                defaults={
                    "max_time":     time_taken,
                    "stroke_count": stroke_count,
                    "accuracy":     accuracy,
                    "completed":    completed,
                    "stars_earned": stars,
                },
            )

        return JsonResponse({
            "stars_earned": stars,
            "completed": completed,
            "accuracy": accuracy,
            "time_taken": time_taken,
        })


@method_decorator(csrf_exempt, name="dispatch")
class ProgressView(LoginRequiredMixin, View):
    """
    GET  /api/progress/       → all level completions for the current user
    POST /api/progress/save/  → thin wrapper kept for backwards-compat with progress.js
    """

    def get(self, request):
        instances = UserLevelInstance.objects.filter(user=request.user)
        data = {
            str(inst.level_id): {
                "stars_earned": inst.stars_earned,
                "completed":    inst.completed,
            }
            for inst in instances
        }
        return JsonResponse(data)

    def post(self, request):
        """
        Accepts the same shape as the existing saveProgress() call in progress.js.
        Delegates to StarView logic if performance data is present,
        otherwise just records completion.
        """
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        level_id = body.get("level_id")
        if not level_id:
            return JsonResponse({"error": "level_id required"}, status=400)

        request._body = request.body
        return StarView.as_view()(request, level_id=level_id)