import os.path
from lib import io
from lib import name
from lib import path
from lib import array


def __create_or_delete__(file_path):
    if os.path.isdir(file_path):
        path.delete_files_in(file_path)
    else:
        os.makedirs(file_path)


def create():

    __create_or_delete__(path.assets('indicators'))

    overview = io.read_json(path.assets('overview.json'))

    # Start by compiling a giant data structure of every company
    companies = {}
    for d in overview:
        company_data = io.read_json(path.assets('%s.json' % d['id']))
        companies[d['id']] = company_data

    # Now aggregate the data by indicator id using the survey data
    survey = io.read_json(path.assets('survey.json'))
    for item in survey:
        indicator_id = item['id'].lower()
        indicator_data = {
            'id': item['id'],
            'name': item['name'],
            'follow': item['follow'],
            'companies': []
        }

        print indicator_id, item['follow']

        for company_id, company in companies.iteritems():
            company_data = [i for i in company if indicator_id == i['id'].lower()]
            if len(company_data) > 1:
                print 'Found too many company matches for', indicator_id

            # This might be an indicator that doesn't apply
            if not len(company_data):
                continue

            company_data = company_data[0]
            company_overview = [c for c in overview if company_id in c['id']]

            if len(company_overview) != 1:
                print 'Weirdness finding company from company overview'
            company_overview = company_overview[0]

            company_type = 'Telecommunications'
            if 'false' in company_overview['telco']:
                company_type = 'Internet'

            indicator_data['companies'].append({
                'name': company_overview['name'],
                'id': company_overview['id'],
                'display': company_overview['display'],
                'score': company_data['score'],
                'type': company_type,
                'levels': company_data['levels'],
                'services': company_data['services']
            })


        indicator_data['companies'] = sorted(indicator_data['companies'], key=lambda c: c['id'])
        io.write_json(path.assets('indicators/%s.json' % indicator_id), indicator_data)

