# Author: Ryan Lanese

"""
Prettifier
"""
class Prettifier(object):

    def __init__(self, file, extra=False):
        self.rules = self.load_file(file)

    def load_file(self, file):
        rules = []
        with open(file, 'r') as f:
            for line in f:
                rules.append(f)
        return rules

def main():
    #style_sheet = '/file/path/style.css'
    prettifier = Prettifier(style_sheet)

if __name__ == "__main__":
    main()