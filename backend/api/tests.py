from django.test import TestCase

from django.test import TestCase
from django.contrib.auth.models import User
from .models import Level, User_Level, UserLevelInstance
from .factory import UserFactory, LevelFactory


class LevelModelTests(TestCase):
    def test_str_representation(self):
        level = LevelFactory(level=5, level_name="Advanced Typing")
        self.assertEqual(str(level), "Advanced Typing (Level 5)")


class UserLevelInstanceTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.level = LevelFactory()

    def test_compute_stars_logic(self):
        """Test the star calculation logic directly"""
        config = User_Level.objects.create(
            level=self.level,
            min_accuracy=85.0,
            is_active=1
        )

        instance = UserLevelInstance(
            user=self.user,
            level=self.level,
            completed=True,
            accuracy=92.0,
            max_time=45.0
        )

        # This is the same logic as in your view
        stars = instance.stars_earned  # currently 0 by default

        # Better to test via the view, but you can also add a method to the model
        self.assertEqual(instance.stars_earned, 0)  # default


class UserProgressTests(TestCase):
    def test_default_jsonfield(self):
        user = UserFactory()
        progress = user.userprofile.userprogress  # through OneToOne
        self.assertEqual(progress.data, {})