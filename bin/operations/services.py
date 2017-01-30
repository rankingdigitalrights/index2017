import os.path
from lib import io
from lib import name
from lib import path
from lib import array

def not_all_found(arr):
    return len([item for item in arr if item == -1])

# create an services json file
def create(filename):

    # Create a dictionary where properties are company names
    overview = io.read_json(path.assets('overview.json'))
    companies = [name.snake_case(item['display']) for item in overview]
    company_dict = {}
    for c in companies:
        company_dict[c] = -1

    # Now use that dictionary to save the index of those company names.
    raw = io.read_csv(path.raw(filename))
    raw_header = raw[0]
    for idx, item in enumerate(raw_header):
        snake_header = name.snake_case(item)
        if snake_header in company_dict:
            company_dict[snake_header] = idx

    # This should be 0 if we've matched every company
    if not_all_found(company_dict.values()):
        print 'Not all companies accounted for in services overview csv'

    # This is where we check a ref file, or create one
    ref_path = path.ref('service-column-mapping.json')
    if os.path.isfile(ref_path):
        ref = io.read_json(ref_path)
    else:
        ref = [name.snake_case(row[0]) for row in raw[1:] if row[0] != '']
        io.write_json(ref_path, ref)

    # Create a dictionary matching row number fo the indicator
    indicator_dict = {}
    for indic in ref:
        indicator_dict[indic] = -1
    for idx, row in enumerate(raw):
        indicator = name.snake_case(row[0])
        if indicator in indicator_dict:
            indicator_dict[indicator] = idx

    if not_all_found(indicator_dict.values()):
        print 'Not all indicators accounted for in services overview csv'

    # Baselines
    tel = 'telco'
    net = 'internet company'

    output = []

    # Get a slice of all the columns that encompass each company
    stops = sorted(idx for idx in company_dict.values())
    for idx, stop in enumerate(stops):
        next_stop = stops[idx+1] if idx + 1 < len(stops) else len(raw_header)
        company_range = [item[stop:next_stop] for item in raw]
        company = {
            'display': company_range[0][0],
            'name': name.filename(company_range[0][0])
        }

        # The second item in the first row *should* be the type
        header_type = company_range[0][1].lower()
        if header_type not in [tel, net]:
            print 'No company type found. Instead, saw %s' % header_type
        company['type'] = header_type

        # The second row contains the service names
        service_names = [item for item in company_range[1]]
        services = []
        for column_number, service_name in enumerate(service_names):

            # Get each indicator value for each service using
            # the indicator mapping we defined earlier
            scores = {}
            for indicator_name, row_number in indicator_dict.iteritems():
                cell = company_range[row_number][column_number]
                scores[indicator_name] = company_range[row_number][column_number]

            # The first 'service' is actually just the overall
            # Do some spreadsheet format-checking here
            if column_number == 0:
                total = scores['total']
                if not len(total):
                    print 'No weighted total for %s %s' % (service_name, company['name'])
                if 'overall' not in service_name:
                    print 'Service %s != "overall"' % service_name
                company['overall'] = scores

            # The second 'service' is usually the group score;
            # No need to save this, we don't use it here.
            elif column_number == 1 and 'group' in service_name:
                continue

            # Otherwise, call it a service.
            else:
                service = {
                    'name': service_name,
                    'scores': scores
                }

                # Get service type if it's available
                service_type = company_range[0][column_number]
                if len(service_type):
                    service['type'] = service_type
                services.append(service)

        company['services'] = services
        output.append(company)

    io.write_json(path.assets('services.json'), output)
