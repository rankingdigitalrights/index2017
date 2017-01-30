def upper_first_char(s):
    return s[0].upper() + s[1:]

def camel_case(s):
    # remove punctuation, lower case, split by spaces
    split = s.replace('.', ' ').lower().split()

    # capitalize first letter of preceding words
    for idx, word in enumerate(split):
        if (idx > 0):
            split[idx] = upper_first_char(split[idx])
    return ''.join(split)

def snake_case(s):
    # remove punctuation, lower case, split by spaces
    split = s.replace('.', ' ').lower().split()
    return '_'.join(split)

def filename(s):
    return s.replace(' ', '').replace('&', '').replace('_', '').lower()
