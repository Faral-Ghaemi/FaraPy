from django import template
from .. import models
from django.core.paginator import Paginator
import os

register = template.Library()

@register.simple_tag
def get_posts(value=5,order='id',sartitr=0):
    if sartitr:

        try:
            posts = models.Post.objects.filter(sartitr=sartitr).order_by('-'+str(order))[:value]
        except:
            posts = models.Post.objects.filter(sartitr=sartitr).order_by('-id')[:value]
    else:
        try:
            posts = models.Post.objects.all().order_by('-'+str(order))[:value]
        except:
            posts = models.Post.objects.all().order_by('-id')[:value]
    return posts

@register.simple_tag
def get_category_posts(title,value=5,order='id',sartitr=0):
    try:
        cat = models.Category.objects.get(id=title)
    except:
        cat = models.Category.objects.get(title=title)
    if sartitr:
        try:
            posts = models.Post.objects.filter(category=cat,sartitr=sartitr).order_by('-'+str(order))[:value]
        except:
            posts = models.Post.objects.filter(category=cat,sartitr=sartitr).order_by('-id')[:value]
    else:
        try:
            posts = models.Post.objects.filter(category=cat,).order_by('-'+str(order))[:value]
        except:
            posts = models.Post.objects.filter(category=cat,).order_by('-id')[:value]
    return posts



@register.simple_tag
def paginator_posts(value=5,page_number=0,order='id',sartitr=0,):
    if sartitr:
        posts = models.Post.objects.filter(sartitr=sartitr).order_by('-' + str(order))[:value]
        paginator = Paginator(posts, value)
        page_obj = paginator.get_page(page_number)
    else:
        posts = models.Post.objects.all().order_by('-' + str(order))[:value]
        paginator = Paginator(posts, value)
        page_obj = paginator.get_page(page_number)
    return page_obj

@register.simple_tag
def get_categories(value=5,order='id'):
    try:
        categories = models.Category.objects.all().order_by('-'+str(order))[:value]
    except:
        categories = models.Category.objects.all().order_by('-id')[:value]

    return categories

@register.simple_tag
def get_category(value):
    try:
        categories = models.Category.objects.get(id=value)
    except:
        categories = models.Category.objects.get(title=value)

    return categories

@register.simple_tag
def get_comments(value=5,order='id'):
    try:
        comments = models.Comment.objects.all().order_by('-'+str(order))[:value]
    except:
        comments = models.Comment.objects.all().order_by('-id')[:value]

    return comments

@register.simple_tag
def get_post_comments(postt,value=5):
    try:
        post = models.Post.objects.get(id=postt)
        comments = models.Comment.objects.filter(post=post)[:value]
    except:
        post = models.Post.objects.last()
        comments = models.Comment.objects.filter(post=post)[:value]

    return comments

@register.simple_tag
def get_sliders(value=5,order='id'):
    try:
        sliders = models.Slider.objects.all().order_by('-'+str(order))[:value]
    except:
        sliders = models.Slider.objects.all().order_by('-id')[:value]

    return sliders

@register.simple_tag
def get_ads(value=5,order='id'):
    try:
        ads = models.Ads.objects.all().order_by('-'+str(order))[:value]
    except:
        ads = models.Ads.objects.all().order_by('-id')[:value]

    return ads

@register.simple_tag
def get_multimedias(value=5,order='id'):
    try:
        multimedias = models.Multimedia.objects.all().order_by('-'+str(order))[:value]
    except:
        multimedias = models.Multimedia.objects.all().order_by('-id')[:value]

    return multimedias

@register.simple_tag
def get_links(value=5,order='id'):
    try:
        links = models.Links.objects.all().order_by('-'+str(order))[:value]
    except:
        links = models.Links.objects.all().order_by('-id')[:value]

    return links

@register.simple_tag
def get_pages(value=5,order='id'):
    try:
        pages = models.Safahat.objects.all().order_by('-'+str(order))[:value]
    except:
        pages = models.Safahat.objects.all().order_by('-id')[:value]

    return pages

@register.simple_tag
def get_videos(value=5,order='id'):
    try:
        videos = models.Video.objects.all().order_by('-'+str(order))[:value]
    except:
        videos = models.Video.objects.all().order_by('-id')[:value]

    return videos

@register.simple_tag
def get_portables(value=5,order='id'):
    try:
        portables = models.Portable.objects.all().order_by('-'+str(order))[:value]
    except:
        portables = models.Portable.objects.all().order_by('-id')[:value]

    return portables

@register.simple_tag
def get_menu(title,value=5):

    m = models.Menu.objects.get(title=title)
    menu = m.submenu_set.all()[:value]


    return menu

@register.simple_tag
def get_portable(user):

    portable = models.Portable.objects.get(user__username=user)


    return portable

@register.simple_tag
def filename(name):
    name = name.replace('-', '_')
    name = name.replace('/', '-')
    name = name.replace('\\', '-')

    name = name.split('-')
    name = name[-1]

    return name

@register.simple_tag
def extension(name):
    main = name
    name = name.replace('-', '_')

    name = name.replace('/', '-')
    name = name.replace('\\', '-')
    name = name.split('-')
    name = name[-1]
    name = name.split('.')
    s = name[1]
    if s == 'js' or s == 'html' or s == 'css' or s == 'txt' or s == 'py':
        return s
    else:
        return 1

@register.simple_tag
def fileurlfordownload(name):
        name = name.replace('\\', '/')
        main = name

        the = models.Setting.objects.last()
        theme = the.theme.name
        static = str('/themes/' + str(theme))
        return '/'+main[len(static):]

@register.simple_tag
def themeurl():
    the = models.Setting.objects.last()
    theme = the.theme.name
    static = str('/themes/' + str(theme) )
    return static

@register.simple_tag
def tu():
    the = models.Setting.objects.last()
    theme = the.theme.name
    static = str('/themes/' + str(theme))
    return static

@register.inclusion_tag('subdirs.html')
def subdirs(file=''):
    if os.path.isfile(os.path.join(file)):
        subdir = -1
    else:
        subdir = [os.path.join(file, f) for f in os.listdir(file) if os.path.isfile(os.path.join(file, f))]
        folders = [os.path.join(file, f) for f in os.listdir(file) if os.path.isdir(os.path.join(file, f))]
        return {
            'folders':folders,
            'subdir': subdir,
            'count':len(subdir),
        }

@register.simple_tag
def subcounts(file=''):
    if os.path.isfile(os.path.join(file)):
        return -1
    else:
        subdir = [os.path.join(file, f) for f in os.listdir(file)]
        return len(subdir)


@register.simple_tag
def cslash(name):
    name = name.replace('-', '_')

    name = name.replace('/','-')
    name = name.replace('\\','-')
    return name


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.simple_tag
def backfolder(name):
    s = os.path.normpath(name + os.sep + os.pardir)
    return s

@register.simple_tag
def menu_url(name):
        x = name.status
        if x == 0:
            return name.subcat.furl()
        elif x == 2:
            return name.subpage.furl()
        else:
            return name.suburl.furl()

@register.inclusion_tag('icons.html')
def suffix(name):
    name = name.replace('-', '_')

    name = name.replace('/', '-')
    name = name.replace('\\', '-')
    name = name.split('-')
    name = name[-1]
    file_extension = name.split('.')
    su = file_extension[-1]
    icon = '031-file'
    if su == 'html':
        icon = 'html'
    elif su == 'css':
        icon = 'css'
    elif su == 'js':
        icon = '026-javascript'
    elif su == 'png':
        icon = 'gallery-pic'
    elif su == 'jpg' or su == 'jpeg':
        icon = 'gallery-pic'
    elif su == 'pdf':
        icon = '018-pdf'
    elif su == 'txt':
        icon = '022-txt'
    elif su == 'zip' or su == 'rar':
        icon = '021-zip'
    return {
        'icon':icon,
    }


