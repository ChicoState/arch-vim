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


class MyLevelView(LoginRequiredMixin, ListView):
    model = Level
    template_name = 'mylevel.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user

        context['BaseCopyrightTextFielded'] = BaseCopyrightTextField.objects.filter(is_active=1)
        context['Background'] = BackgroundImageBase.objects.filter(is_active=1, page=self.template_name).order_by(
            "position")
        context['Titles'] = Titled.objects.filter(is_active=1, page=self.template_name).order_by("position")
        context['Header'] = NavBarHeader.objects.filter(is_active=1).order_by("row")
        context['DropDown'] = NavBar.objects.filter(is_active=1).order_by('position')
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

        user = self.request.user
        if user.is_authenticated:
            user_clickables = UserClickable.objects.filter(user=user)
            for user_clickable in user_clickables:
                if user_clickable.clickable.chance_per_second > 0:
                    user_clickable.precomputed_chance = 1000 / user_clickable.clickable.chance_per_second
                    print('chance exists' + str(user_clickable.precomputed_chance))
                else:
                    user_clickable.precomputed_chance = 0

            context["Clickables"] = user_clickables
            context['Profile'] = ProfileDetails.objects.filter(is_active=1, user=user)
            profile = ProfileDetails.objects.filter(user=user).first()
            if profile:
                context['profile_pk'] = profile.pk
                context['profile_url'] = reverse('showcase:profile', kwargs={'pk': profile.pk})

        context['SettingsModel'] = SettingsModel.objects.filter(is_active=1)

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

        if self.request.user.is_authenticated:
            userprofile = ProfileDetails.objects.filter(is_active=1, user=self.request.user)
        else:
            userprofile = None

        if userprofile:
            context['NewsProfiles'] = userprofile
        else:
            context['NewsProfiles'] = None

        if context['NewsProfiles'] == None:

            userprofile = type('', (), {})()
            userprofile.newprofile_profile_picture_url = 'static/css/images/a.jpg'
            userprofile.newprofile_profile_url = None
        else:
            for userprofile in context['NewsProfiles']:
                user = userprofile.user
                profile = ProfileDetails.objects.filter(user=user).first()
                if profile:
                    userprofile.newprofile_profile_picture_url = profile.avatar.url
                    userprofile.newprofile_profile_url = userprofile.get_profile_url()

        return context
