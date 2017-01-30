from lib import io
from lib import name
from lib import path

# create an overview json file
def create(filename):
    raw = io.read_csv_as_dictionary(path.raw(filename))
    d = []
    # camelcase company name for consistency
    for x in raw:
        company = name.camel_case(x['Company'])

        # true/false whether telco
        is_telco = 'false'
        if 'telco' in x['Type'].lower():
            is_telco = 'true'

        d.append({
            'name': company,
            'id': name.filename(company),
            'display': x['Company'],
            'total': x['Total'],
            'commitment': x['Commitment'],
            'freedom': x['Freedom of Expression'],
            'privacy': x['Privacy'],
            'telco': is_telco
        })

    io.write_json(path.assets('overview.json'), d)
