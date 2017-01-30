import os.path
from lib import io
from lib import name
from lib import path
from lib import array

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False


def not_all_found(arr):
    return len([item for item in arr if item == -1])


def simplify_response(s):
    if 'yes' in s:
        return 0
    elif 'no' in s:
        return 1
    elif 'partial' in s:
        return 2
    else:
        print 'Something is wrong', s
        return 3


def exclude_service(indicator):
    return indicator.lower() not in ['c1', 'c2', 'c3', 'c4', 'c5']


def scrub_service_name(n):
    for remove in ['service', 'group', 'operating company']:
        n = ' '.join([word.strip() for word in n.split('(%s)' % remove)])

    # Lowercase, strip the FOE/P stuff
    n = n.lower().replace(' - freedom of expression', '').replace(' - privacy', '')

    # Uppercase each word
    n = [word[0].upper() + word[1:] for word in n.split(' ')]

    return ' '.join(n)

def get_options_index(options, item):
    for idx, option in enumerate(options):
        if len(item) == len(option):
            return idx

    # If the item is no, check again if we actually meant
    # no/insufficient evidence
    if item == 'no':
        item = 'no/insufficient evidence'
        return get_options_index(options, item)
    return -1


def create(filename):

    company_name = name.filename(filename[:-4])

    all_services = io.read_json(path.assets('services.json'))
    service_data = [item for item in all_services if (company_name
        in item['name'].replace('.', ''))]

    if len(service_data) != 1:
        print 'Weird number of services found', len(service_data)

    service_data = service_data[0]

    # Create a mapping dictionary of just indicator names
    # each mapped to -1
    ref = io.read_json(path.ref('service-column-mapping.json'))
    indicator_dict = {}
    for item in ref:
        if is_number(item[1:]):
            indicator_dict[item] = -1


    # Map the indicator to the proper rows
    raw = io.read_csv(path.raw('companies/' + filename))
    for idx, row in enumerate(raw):
        indicator = row[0].lower()
        if indicator in indicator_dict:
            indicator_dict[indicator] = idx

    # Use the survey data to map possible responses to position
    survey = io.read_json(path.assets('survey.json'))

    if not_all_found(indicator_dict.values()):
        print 'Not all indicators accounted for in services overview csv'

    all_indicators = []

    # Get a slice of all the rows that encompass each company
    stops = sorted(idx for idx in indicator_dict.values())
    for idx, stop in enumerate(stops):
        next_stop = stops[idx+1] if idx + 1 < len(stops) else len(raw) + 1
        indicator_range = raw[stop:next_stop]

        # Divide that slice by empty rows
        split = array.slice_arr(indicator_range, array.is_empty_row)

        # The first slice contains consolidated answers,
        # comments, and sources.
        responses = split.pop(0)

        # The first row of responses is indicator name followed by
        # service categories
        header = [item for item in responses.pop(0) if len(item)]

        indicator_name = header[0]

        # Find the survey question we're looking for
        survey_item = ([item for item in survey
            if item['id'].lower() == indicator_name.lower()])

        if len(survey_item) != 1:
            print 'Too many items in survey.json for this indicator'
            print indicator_name
            print survey_item

        indicator_data = {
            'id': indicator_name,
            'services': [],
            'levels': []
        }

        # Check if this indicator is valid before continuing
        if len(responses) == 1 and 'this indicator is n/a' in responses[0][0].lower():
            continue
        else:

            # question scores follow the response text in the split array
            scores = split.pop(0)

            # ..followed by the overall indicator score (verify this)
            indicator_score = split.pop(-1)[0][1] if ('indicator score'
                in split[-1][0][0].lower()) else []
            if not len(indicator_score):
                print '\nIndicator score not found in %s' % header[0]
                print split, '\n'
            else:
                indicator_data['score'] = indicator_score

            # ..and the same for the overall service scores
            level_scores = split.pop(-1)[0] if ('level score'
                in split[-1][0][0].lower()) else []
            if not len(level_scores):
                print '\nService score not found in %s' % header[0]
                print split, '\n'

            # Determine the comments and sources location
            comments = responses.pop(-2)
            sources = responses.pop(-1)

            if ('comments' not in comments[0].lower() or
                'sources' not in sources[0].lower()):
                print 'Comments not found in %s' % comments[0]
                print 'Sources not found in %s' % sources[0]

            # Some question text include an if-not-then clause,
            # which throws off the count between the text and the score.
            # Record it and then delete the row.
            indicator_data['follow'] = 0
            for idx, row in enumerate(responses):
                if 'continue with B' in row[0] and len(set(row[1:])) == 1:
                    indicator_data['follow'] = 1
                    del responses[idx]
                    break

            if len(responses) != len(scores):
                print 'Length of responses and scores not matching'
                print len(responses), len(scores)


            # Save level responses, and level positions
            # Determine if this question has custom answers
            survey_levels = survey_item[0]['levels']
            for idx, level in enumerate(responses):
                level_data = []

                # Assume anything longer than 25 characters,
                # aka "no/insufficient evidence", is a custom response
                custom = 0
                survey_options = survey_levels[idx]['responses']
                for option in survey_options:
                    if len(option) > 25:
                        custom = 1

                for level_idx, level_response in enumerate(level):

                    # First level index is useless.
                    if level_idx == 0 or not len(level_response):
                        continue

                    if len(header) <= level_idx:
                        print 'No header available, this will break'

                    service = header[level_idx]

                    # Exclude group scores, operating company
                    # from indicators that don't need them
                    if (('(group)' in service or '(operating company)' in service )
                            and exclude_service(indicator_name)):
                        continue

                    # Shim issues where the response includes too much text.
                    if len(level_response) > 25 and "no/insufficient" == level_response[:15]:
                        level_response = "no/insufficient evidence"


                    # Only add to the services list if we're on the first level.
                    # Other, we add too many
                    if idx == 0:

                        if 'operating company' in service.lower():
                            service_type = 'operating company'
                        elif 'group' in service.lower():
                            service_type = 'group'
                        else:
                            matching_service = [item for item in service_data['services'] if (
                                item['name'].lower() in service.lower())]
                            if len(matching_service) == 1 and 'type' in matching_service[0]:
                                service_type = matching_service[0]['type']
                            else:
                                service_type = ''

                        indicator_data['services'].append({
                            'name': scrub_service_name(service),
                            'type': service_type,
                            'comments': comments[level_idx],
                            'sources': sources[level_idx],
                            'score': level_scores[level_idx]
                        })

                    level_data.append({
                        'response': level_response,
                        'score': scores[idx][level_idx]
                    })


                indicator_data['custom'] = custom
                indicator_data['levels'].append({
                    'scores': level_data,
                    'text': survey_levels[idx]['text']
                })

        all_indicators.append(indicator_data)

    io.write_json(path.assets(company_name + '.json'), all_indicators)
