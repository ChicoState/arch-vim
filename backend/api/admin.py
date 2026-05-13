from django.contrib import admin
from django.utils.html import mark_safe
from .models import UserProfile, UserProgress, Level, User_Level, UserLevelInstance


class UserProgressInline(admin.StackedInline):
    model = UserProgress
    extra = 0


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    extra = 0


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('level', 'level_name', 'get_color_preview', 'get_icon_preview', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('level_name',)
    list_filter = ('is_active',)
    readonly_fields = ('get_icon_preview',)

    def get_icon_preview(self, obj):
        if obj.icon:
            return mark_safe('<img src="{}" style="width: 30px; height: 30px; border-radius: 5px;" />', obj.icon.url)
        return "No Icon"

    get_icon_preview.short_description = "Icon Preview"

    def get_color_preview(self, obj):
        hex_color = obj.color_wheel or "#ffffff"
        gradient = f"linear-gradient(to right, {obj.color})" if obj.color else hex_color

        return mark_safe(
            '<div style="width: 50px; height: 20px; border: 1px solid #000; background: {}; border-radius: 3px;"></div>',
            gradient
        )

    get_color_preview.short_description = "Color/Gradient"


@admin.register(User_Level)
class UserLevelAdmin(admin.ModelAdmin):
    list_display = ('level', 'min_accuracy', 'max_keystrokes', 'stars', 'is_active')
    list_filter = ('level', 'is_active')


@admin.register(UserLevelInstance)
class UserLevelInstanceAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'stars_earned', 'accuracy', 'max_time', 'completed', 'attempted_at')
    list_filter = ('completed', 'stars_earned', 'level')
    search_fields = ('user__username', 'level__level_name')
    readonly_fields = ('attempted_at',)

    def stars_earned_display(self, obj):
        return mark_safe(
            '<span style="color: orange; font-weight: bold;">{}</span>',
            "★" * obj.stars_earned + "☆" * (3 - obj.stars_earned)
        )

    stars_earned_display.short_description = "Stars"

    list_display = ('user', 'level', 'stars_earned_display', 'accuracy', 'completed', 'attempted_at')


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_data_summary')

    def get_data_summary(self, obj):
        return str(obj.data)[:50] + "..." if obj.data else "{}"

    get_data_summary.short_description = "Data Preview"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)
    inlines = [UserProgressInline]