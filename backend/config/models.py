from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from colorfield.fields import ColorField

from django.contrib.auth.models import User




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
    min_accuracy = models.FloatField(validators=[MaxValueValidator(100)])
    max_keystrokes = models.IntegerField(blank=True, null=True)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(1)]) #create a function to determine accuracy & time, pulled from frontend data
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

    class Meta():
        verbose_name_plural = "User's Levels"
