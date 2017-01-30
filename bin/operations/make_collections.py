import os
from lib import io
from lib import name
from lib import path
from lib import array

def __create_or_delete__(file_path):
    if os.path.isdir(file_path):
        path.delete_files_in(file_path)
    else:
        os.makedirs(file_path)


def companies():
    __create_or_delete__(path.companies('')[:-1])
    overview = io.read_json(path.assets('overview.json'))
    for company in overview:
        filename = (company['name'] + '.md').lower().replace('&', '')
        with open(path.companies(filename), 'w') as f:
            f.write('---\n')
            f.write('entity: %s\n' % filename[:-3])

            f.write('\nlayout: company\n\n')

            for key, value in company.iteritems():
                if key in ['total', 'commitment', 'privacy', 'freedom']:
                    f.write('%s: %s' % (key, int(round(float(value)))))
                else:
                    f.write('%s: %s' % (key, value))
                f.write('\n')
            f.write('\ndescription: one-line description\n')
            f.write('website: http://example.com')
            f.write('\n---\n\n')
            f.write('Paragraph describing this company\n')


def indicators():
    __create_or_delete__(path.indicators('')[:-1])
    custom = io.read_json(path.assets('custom-questions.json'))
    indicators = io.read_json(path.assets('survey.json'))
    for idx, indicator in enumerate(indicators):
        indicator_id = indicator['id'].lower()

        # Determine if it's in the list of custom indicators
        is_custom = False
        if indicator_id in custom:
            is_custom = True

        filename = (indicator_id + '.md')
        with open(path.indicators(filename), 'w') as f:
            f.write('---\n')
            f.write('sort: %s\n' % idx)
            f.write('entity: %s\n' % filename[:-3])
            f.write('entity_type: indicator\n')

            first_letter = filename[0]
            if 'c' in first_letter:
              f.write('category_ref: commitment\n')
              f.write('category: Commitment\n')
            elif 'f' in first_letter:
              f.write('category_ref: freedom-of-expression\n')
              f.write('category: Freedom of Expression\n')
            else:
              f.write('category_ref: privacy\n')
              f.write('category: Privacy\n')

            f.write('\nlayout: indicator\n\n')

            # text, id, name
            for item in ['name', 'text', 'id']:
                f.write('%s: %s\n' % (item, indicator[item].encode('UTF-8')))

            # possible answers
            f.write('\nlevels:\n')
            for idx, resp in enumerate(indicator['levels']):

                # first, just make sure we write level text
                if resp['text'] != 0:
                    f.write('  - text: "%s"\n' % resp['text'].encode('UTF-8'))
                    f.write('    id: %s\n' % resp['id'].encode('UTF-8'))

                # this is really only for c1.b at this point.
                if not is_custom and resp['id'].lower() in custom:
                    custom_answer = custom[resp['id'].lower()]
                    f.write('    choices:\n')
                    for a in custom_answer:
                        f.write('      - text: "%s"\n' % a['text'].encode('UTF-8'))
                        f.write('        score: "%s"\n' % a['score'])

            f.write('\nchoices:\n')
            if is_custom:
                custom_answer = custom[indicator_id]
                for a in custom_answer:
                    f.write('  - text: "%s"\n' % a['text'].encode('UTF-8'))
                    f.write('    score: "%s"\n' % a['score'])


            f.write('\n---\n\n')


def categories():
    __create_or_delete__(path.categories('')[:-1])
    categories = ['privacy', 'freedom-of-expression', 'commitment']
    for cat in categories:
        filename = cat + '.md'
        with open(path.categories(filename), 'w') as f:
            f.write('---\n')
            f.write('entity: %s\n' % filename[:-3])
            f.write('entity_type: category\n')

            f.write('\nvisualization: category')
            f.write('\nlayout: category\n\n')


            display = ' '.join([word[0].upper() + word[1:] for word in cat.split('-')])
            f.write('display: %s\n' % display)
            f.write('\n---\n\n')
