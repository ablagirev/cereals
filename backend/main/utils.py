

def read_byte_file(path_file):
    with open(path_file, 'rb') as file:
        raw = file.read()
    return raw


def save_file(content, path):
    with open(path, 'wb') as file:
        file.write(content)
    return path
