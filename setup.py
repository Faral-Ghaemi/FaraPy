from setuptools import setup,find_packages

install_requires = [
    "Django>=2.2.7,<3",
    "django_jalali",
    "jdatetime",
    "django-ckeditor",
    "sorl-thumbnail",
    "kavenegar",
    "django-widget-tweaks",
    "Pillow>=4.0.0,<9.0.0",
    "simplejson",
    'copier',
]

setup(
    name='farapy',
    version='1.32',
    packages=['bin'],
    url='https://faral.tech',
    license='BSD',
    author='Faral Team',
    author_email='faral.ghaemi@gmail.com',
    description='FaraPy is a smart content management system (CMS) written in Python.',
    python_requires='>=3.6',
    install_requires=install_requires,
    entry_points="""
            [console_scripts]
            farapy=bin.farapy:main
    """,
)
