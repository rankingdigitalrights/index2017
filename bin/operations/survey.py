from lib import io
from lib import name
from lib import path
from lib import array

# create an indicators json file
def create(filename):
    raw = io.read_csv(path.raw(filename))

    # input file uses empty rows to separate questions.
    groups = array.slice_arr(raw, array.is_empty_row)

    # find where each indicator is based on row length
    survey = []
    for grouping in groups:

        # strip empty cells
        stripped = []
        for row in grouping:
            stripped.append([item for item in row if item != ''])

        # responses all occupy more than one cell in a row
        responses = [item for item in stripped if len(item) > 1]

        # single cells are either separators, or question texts
        single_cells = [item[0] for item in stripped if len(item) == 1]

        # these are separators - check for them
        checklist = 'checklist elements'
        categories = 'answer categories'

        # more than one here means there are follow-ups
        question = [item for item in single_cells if checklist not in item.lower()
                and categories not in item.lower()]
        if len(question) > 1:
            followups = question[1:]
        else:
            followups = 0

        # separate name and text
        question = question[0]
        line_break = question.find('\n')
        if line_break > 0:
            name = question[:line_break]
            question = question[line_break+1:]
        else:
            name = question
            question = ''

        # id is 1st two chars
        question_id = name[0:name.find('.')]
        survey.append({
            'id': question_id,
            'name': name,
            'text': question,
            'follow': followups,
            'levels': [{
                'id': item[0].strip(),
                'text': item[1].strip() if categories not in item[1].lower() else 0,
                'responses': item[2:]
            } for item in responses]
        })

    io.write_json(path.assets('survey.json'), survey)
