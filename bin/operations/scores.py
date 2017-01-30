import os.path
from lib import io
from lib import name
from lib import path
from lib import array

# create an services json file
def create_indicator_scores():
    companies = io.read_json(path.assets('services.json'))
    survey = io.read_json(path.assets('survey.json'))

    indicator_data = []
    for i in survey:
        indicator_id = i['id'].lower()
        scores = {}
        levels = {}

        for c in companies:
            c_name = c['display']
            c_overall = c['overall']
            if indicator_id in c_overall:
                scores[c_name] = c_overall[indicator_id]
            else:
                print 'no %s in %s' % (indicator_id, ' '.join(c_overall))

        print i['name']
        indicator_data.append({
            'id': indicator_id,
            'scores': scores,
            'text': i['text'],
            'name': i['name']
        })
    io.write_json(path.assets('indicator-overview.json'), indicator_data)
