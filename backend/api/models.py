from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from colorfield.fields import ColorField

from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class UserProgress(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)
    data = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.user.username}'s level progress"

def to_roman(n):
    """Simple helper to convert numbers 1-5 to Roman numerals"""
    return {1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V'}.get(n, str(n))

class Level(models.Model):
    COLOR_PALETTE = [
        ("#FFFFFF", "white",),
        ("#000000", "black",),
    ]
    level = models.IntegerField(default=1, blank=True, null=True)
    level_name = models.CharField(max_length=200)
    experience = models.IntegerField(default=0, blank=True, null=True)
    icon = models.ImageField(blank=True, null=True)
    color_wheel = ColorField(samples=COLOR_PALETTE, blank=True, null=True)
    color = models.CharField(max_length=500, blank=True, null=True, help_text="Comma-separated hex colors for gradient")
    display_name = models.CharField(
        max_length=300,
        blank=True,
        editable=False,
        verbose_name="Display Name (with Roman if needed)"
    )

    is_active = models.IntegerField(
        default=1,
        blank=True,
        null=True,
        help_text='1->Active, 0->Inactive',
        choices=((1, 'Active'), (0, 'Inactive')),
        verbose_name="Set active?"
    )

    def __str__(self):
        # Changed from the 'Rules' version to the 'Instance' version
        return f"{self.level_name} (Level {self.level})"

    def save(self, *args, **kwargs):
        # IMPLEMENTATION: This satisfies test_level_display_name_generation
        roman = to_roman(self.level)
        self.display_name = f"{self.level_name} {roman}"
        super().save(*args, **kwargs)

#essentially treated like a through model branching together users & levels
class User_Level(models.Model):
    COLOR_PALETTE = [
        ("#FFFFFF", "white",),
        ("#000000", "black",),
    ]
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    min_accuracy = models.FloatField(validators=[MaxValueValidator(100)])
    max_keystrokes = models.IntegerField(blank=True, null=True)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(3)], blank=True, null=True) #create a function to determine accuracy & time, pulled from frontend data
    is_active = models.IntegerField(
        default=1,
        blank=True,
        null=True,
        help_text='1->Active, 0->Inactive',
        choices=((1, 'Active'), (0, 'Inactive')),
        verbose_name="Set active?"
    )

    def __str__(self):
        return f"{self.level.level_name} Rules - {self.stars} Stars"

    class Meta():
        verbose_name_plural = "User's Levels"



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
        return f"{self.level.level_name} Rule: {self.stars} Stars @ {self.min_accuracy}%"

    def save(self, *args, **kwargs):
        # Find the rules for this level
        rules = User_Level.objects.filter(level=self.level, is_active=1).order_by('-stars')

        if self.completed and self.accuracy:
            for rule in rules:
                if self.accuracy >= rule.min_accuracy:
                    self.stars_earned = rule.stars
                    break
        super().save(*args, **kwargs)

# models.py
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = UserProfile.objects.create(user=instance)
        UserProgress.objects.create(user=profile)