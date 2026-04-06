from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=True, null=True)
    avatar = models.ImageField(upload_to='profile_image', null=True, blank=True, verbose_name="Profile picture")
    alternate = models.TextField(verbose_name="Alternate text", null=True, blank=True)
    about_me = models.TextField(blank=True, null=True)
    level = models.ForeignKey('Level', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.IntegerField(default=1,
                                    blank=True,
                                    null=True,
                                    help_text='1->Active, 0->Inactive',
                                    choices=((1, 'Active'), (0, 'Inactive')), verbose_name="Set active?")

    def __str__(self):
        return str(self.user) + " Selling Status: " + str(self.seller) + " Membership: " + str(self.membership)


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    def __str__(self):
        return self.title

class Level(models.Model):
    COLOR_PALETTE = [
        ("#FFFFFF", "white",),
        ("#000000", "black",),
    ]
    level = models.IntegerField(default=1, blank=True, null=True)
    level_name = models.CharField(max_length=200)
    numeral = models.IntegerField(blank=True, null=True)
    experience = models.IntegerField(default=0, blank=True, null=True)
    icon = models.ImageField(blank=True, null=True)
    color_wheel = ColorField(samples=COLOR_PALETTE, blank=True, null=True)
    color = models.CharField(max_length=500, blank=True, null=True, help_text="Comma-separated hex colors for gradient")
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
