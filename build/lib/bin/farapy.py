import os
import re
import sys
from argparse import ArgumentParser
import copier


def pluralize(value, arg='s'):
    return '' if value == 1 else arg


class Command:
    description = None

    def create_parser(self, command_name=None):
        if command_name is None:
            prog = None
        else:
            # hack the prog name as reported to ArgumentParser to include the command
            prog = "%s %s" % (prog_name(), command_name)

        parser = ArgumentParser(
            description=getattr(self, 'description', None), add_help=False, prog=prog
        )
        self.add_arguments(parser)
        return parser

    def add_arguments(self, parser):
        pass

    def print_help(self, command_name):
        parser = self.create_parser(command_name=command_name)
        parser.print_help()

    def execute(self, argv):
        parser = self.create_parser()
        options = parser.parse_args(sys.argv[2:])
        options_dict = vars(options)
        self.run(**options_dict)


class Version(Command):
    description = "Version of your FaraPy project"

    def run(self):
        print("You are using FaraPy %(version)s" % {'version': 1.32})


class CreateProject(Command):
    description = "Creates FaraPy project."

    def add_arguments(self, parser):
        parser.add_argument('project_name', help="Name for your FaraPy project")

    def run(self, project_name=None, dest_dir=None):
        # Make sure given name is not already in use by another python package/module.
        try:
            __import__(project_name)
        except ImportError:
            pass
        else:
            sys.exit("'%s' conflicts with the name of an existing "
                     "Python module and cannot be used as a project "
                     "name. Please try another name." % project_name)

        print("Creating a FaraPy project called %(project_name)s" % {'project_name': project_name})

        
  
        os.mkdir(project_name)
        copier.copy("https://github.com/Faral-Ghaemi/FaraPy.git", project_name + "/")

        print("Success! %(project_name)s has been created" % {'project_name': project_name}) 


COMMANDS = {
    'start': CreateProject(),
    '--version': Version(),
}


def prog_name():
    return os.path.basename(sys.argv[0])


def help_index():
    print("Type '%s help <subcommand>' for help on a specific subcommand.\n" % prog_name())  # NOQA
    print("Available subcommands:\n")  # NOQA
    for name, cmd in sorted(COMMANDS.items()):
        print("    %s%s" % (name.ljust(20), cmd.description))  # NOQA


def unknown_command(command):
    print("Unknown command: '%s'" % command)  # NOQA
    print("Type '%s help' for usage." % prog_name())  # NOQA
    sys.exit(1)


def main():
    try:
        command_name = sys.argv[1]
    except IndexError:
        help_index()
        return

    if command_name == 'help':
        try:
            help_command_name = sys.argv[2]
        except IndexError:
            help_index()
            return

        try:
            command = COMMANDS[help_command_name]
        except KeyError:
            unknown_command(help_command_name)
            return

        command.print_help(help_command_name)
        return

    try:
        command = COMMANDS[command_name]
    except KeyError:
        unknown_command(command_name)
        return

    command.execute(sys.argv)


if __name__ == "__main__":
    main()
