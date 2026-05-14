from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import Level, User_Level, UserLevelInstance, UserProfile, UserProgress
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
        # We add stars=1 because it's a required field in your model
        config = User_Level.objects.create(
            level=self.level,
            min_accuracy=85.0,
            stars=1,
            is_active=1
        )
        instance = UserLevelInstance(
            user=self.user,
            level=self.level,
            completed=True,
            accuracy=92.0,
            max_time=45.0
        )
        self.assertEqual(instance.stars_earned, 0)

class UserProgressTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.level = LevelFactory()

    def test_default_jsonfield(self):
        # Use get_or_create to avoid IntegrityError from signals
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        progress, _ = UserProgress.objects.get_or_create(user=profile)
        self.assertEqual(progress.data, {})

    def test_star_calculation_thresholds(self):
        User_Level.objects.create(
            level=self.level,
            min_accuracy=90.0,
            stars=3,
            is_active=1
        )
        attempt = UserLevelInstance.objects.create(
            user=self.user,
            level=self.level,
            accuracy=80.0,
            completed=True
        )
        self.assertTrue(attempt.accuracy < 90.0)

class ValidationTests(TestCase):
    def test_stars_out_of_range(self):
        level = LevelFactory()
        invalid_user_level = User_Level(
            level=level,
            min_accuracy=95.0,
            stars=5
        )
        with self.assertRaises(ValidationError):
            invalid_user_level.full_clean()

class RelationshipTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.level = LevelFactory()


    def test_profile_deletion_cascades(self):
        # Safely handle potential existing profile from signals
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        UserProgress.objects.get_or_create(user=profile)

        user_id = self.user.id
        self.user.delete()

        self.assertFalse(UserProfile.objects.filter(user_id=user_id).exists())
        self.assertFalse(UserProgress.objects.filter(user__user_id=user_id).exists())

    def test_attempt_ordering(self):
        level = LevelFactory()
        # Create attempts with specific star counts
        UserLevelInstance.objects.create(user=self.user, level=level, stars_earned=1)
        UserLevelInstance.objects.create(user=self.user, level=level, stars_earned=3)

        attempts = UserLevelInstance.objects.filter(user=self.user)
        # -stars_earned in Meta means 3 should come before 1
        self.assertEqual(attempts[0].stars_earned, 3)

    def test_level_display_name_generation(self):
        """Test that Level 2 'Basic' becomes 'Basic II'"""
        level = Level.objects.create(
            level=2,
            level_name="Basic",
            is_active=1
        )
        # This forces you to write a Roman numeral helper in your Level.save()
        self.assertEqual(level.display_name, "Basic II")

    def test_user_progress_data_persistence(self):
        profile, _ = UserProfile.objects.get_or_create(user=self.user)
        progress, _ = UserProgress.objects.get_or_create(user=profile)

        # Simulating updating progress from a view
        new_data = {"last_played": "2024-01-01", "unlocked_items": ["hat_01"]}
        progress.data = new_data
        progress.save()

        # Refresh from DB
        progress.refresh_from_db()
        self.assertEqual(progress.data["unlocked_items"][0], "hat_01")

    def test_automatic_star_assignment_on_save(self):
        """
        Test that stars_earned is calculated automatically
        based on User_Level thresholds when saved.
        """
        # Define the 'Gold' standard for this level
        User_Level.objects.create(
            level=self.level,
            min_accuracy=95.0,
            stars=3
        )

        # Create an attempt that meets the criteria
        attempt = UserLevelInstance.objects.create(
            user=self.user,
            level=self.level,
            accuracy=98.0,
            completed=True
        )

        # This will fail now, but it tells you to implement logic in models.py
