from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class LevelRender(LoginRequiredMixin, ListView):
    model = Level
    template_name = 'level.html' #dependant on what the template render is 

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        profile = ProfileDetails.objects.filter(user=user).first()
        mylevel = math.floor(1.02 ** profile.level.level)
        context['created_level'] = mylevel
        if self.request.user.is_authenticated:
            context['StockObject'] = InventoryObject.objects.filter(
                is_active=1, user=self.request.user
            ).order_by("created_at")
            context['preferenceform'] = MyPreferencesForm(user=self.request.user)
        context['Favicon'] = FaviconBase.objects.filter(is_active=1)
        context['Logo'] = LogoBase.objects.filter(Q(page=self.template_name) | Q(page='navtrove.html'), is_active=1)

        levels = Level.objects.filter(is_active=1).order_by("level")
        context['levels'] = [
            {
                "level": level,
                "background": level.get_background_style(),
                "given_level": level.level,
                "actual_level": level.actual_level,
            }
            for level in levels
        ]

        if user.is_authenticated:
            profile = ProfileDetails.objects.filter(user=user, is_active=1).first()
            if profile:
                context['Profile'] = profile
                context['profile_pk'] = profile.pk
                context['profile_url'] = reverse('showcase:profile', kwargs={'pk': profile.pk})
            else:
                context['Profile'] = None
        else:
            context['Profile'] = None
        return context
