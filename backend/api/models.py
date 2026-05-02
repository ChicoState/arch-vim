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
        return f"{self.level_name} (Level {self.level})"

#essentially treated like a through model branching together users & levels
class User_Level(models.Model):
    COLOR_PALETTE = [
        ("#FFFFFF", "white",),
        ("#000000", "black",),
    ]
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    stars = models.IntegerField(minvalidator=1, maxvalidator=3) #create a function to determine accuracy & time, pulled from frontend data
    is_active = models.IntegerField(
        default=1,
        blank=True,
        null=True,
        help_text='1->Active, 0->Inactive',
        choices=((1, 'Active'), (0, 'Inactive')),
        verbose_name="Set active?"
    )