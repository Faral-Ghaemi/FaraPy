
from . import models
from datetime import date, timedelta

from django.contrib.auth import logout
import urllib.request
import xml.etree.ElementTree as ET

today = date.today()
def context(request):
    if models.Setting.objects.exists():
        setting = models.Setting.objects.last()
        if not setting.theme:
            setting.theme = models.Theme.objects.first()
            setting.save()
        """
            Return context variables required by apps that use Django's authentication
            system.

            If there is no 'user' attribute in the request, use AnonymousUser (from
            django.contrib.auth).

            """
        setting = models.Setting.objects.last()
        try:
            Portable = models.Portable.objects.get(user=request.user)
            port = 1
        except Exception as e:
            Portable = ''
            port = 0

        try:
            Media = []

            url = 'http://parsijoo.ir/api?serviceType=weather-API&q=' + str(setting.city)
            f = urllib.request.urlopen(url)
            dom = ET.parse(f)  # parse the data
            # tree = ET.ElementTree ( file = f )
            # MediaElement = tree.getroot()
            # Media = dict((e.tag, e.text) for e in MediaElement .getchildren())

            link = dom.getroot()
            categories = [items for items in link]

            for items in link:
                Media.append(items)

            city = Media[0][0][0][4].text
            temp = Media[0][0][0][3].text
            symbol = Media[0][0][0][2].text
        except Exception as e:
            Media = []
            city = ''
            temp = ''
            symbol = ''
        setting = models.Setting.objects.last()
        today = date.today()

        lin = setting.expdate - today
        edays = lin.days
        if request.user.is_superuser:
            pass
        else:
            if edays <= 0:
                logout(request)

        mmenu = models.Menu.objects.filter(status=0).last()
        smenu = models.Menu.objects.filter(status=1).last()
        category = models.Category.objects.filter(pcategory__isnull=True).order_by('olaviat')
        subcategory = models.Category.objects.all()
        categories = models.Category.objects.all().order_by('-id')
        sartitr = models.Post.objects.filter(sartitr=1)[:5]
        today = date.today()
        ads = models.Ads.objects.filter(EXdate__gte=today)
        slider = models.Slider.objects.last()
        multimedia = models.Multimedia.objects.all().order_by('-id')[:5]
        multi = models.Multimedia.objects.all().order_by('-id')[:6]
        hotnews = models.Post.objects.all().order_by('-id')
        llslider = models.Post.objects.all().order_by('-id')[:5]
        links = models.Links.objects.all().order_by('-id')[:5]
        setting = models.Setting.objects.last()
        popular = models.Post.objects.all().order_by('-view')[:3]
        co = models.Comment.objects.filter(status=0).count()
        comments = models.Comment.objects.all().order_by('-id')
        logo = setting.logo
        task = models.Task_manegar.objects.filter(status=1).count()
        popcat = models.Category.objects.all().order_by('-pcount')
        mahbob = models.Post.objects.all().order_by('-view')[:10]
        natije = 0
        return {
            'categories':categories,
            'comments':comments,
            'mahbob': mahbob,
            'popcat': popcat,
            'logo': logo,
            'task': task,
            'mmenu': mmenu,
            'smenu': smenu,
            'co': co,
            'port': port,
            'natije': natije,
            'portablee': Portable,
            'llslider': llslider,
            'city': city,
            'subcategory': subcategory,
            'temp': temp,
            'symbol': symbol,
            'setting': setting,
            'popular': popular,
            'sartitr': sartitr,
            'links': links,
            'hotnews': hotnews,
            'multi': multi,
            'multimedia': multimedia,
            'slider': slider,
            'today': today,
            'category': category,
            'ads': ads,
        }

    else:
        return {
            's':'s'
        }
