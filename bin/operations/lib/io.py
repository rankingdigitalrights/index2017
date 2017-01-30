import csv
import json

# read csv as two-dimensional list
def read_csv(filename):
    data = []
    with open(filename, 'rU') as f:
        f = csv.reader(f)
        for row in f:
            data.append(row)
    return data


# read csv as a dictionary where properties are headers (first row)
def read_csv_as_dictionary(filename):
    csv = read_csv(filename)
    headers = csv.pop(0)
    data = list()
    for row in csv:
        d = dict()
        for index, header in enumerate(headers):
            d[header] = row[index]
        data.append(d)
    return data


# write csv to filename
def write_csv(filename, data):
    with open(filename, 'wb') as f:
        writer = csv.writer(f)
        writer.writerows(data)


# read json as native structure
def read_json(filename):
    with open(filename) as f:
        d = json.load(f)
    return d


# write json to filename
def write_json(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f)


# write json using pretty-printing
def write_json_pretty(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, sort_keys=True,
                indent=4, separators=(',', ': '))
