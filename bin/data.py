from os import listdir
from os.path import isfile, join
from operations.overview import create as create_overview
from operations.survey import create as create_survey
from operations.services import create as create_services
from operations.companies import create as create_company
from operations.scores import create_indicator_scores
from operations.indicators import create as create_indicators

print '\n\n'
print 'overview.csv > app/assets/static/overview.json'
#create_overview('overview.csv')
print '...success!'

print '\n\n'
print 'survey.csv > app/assets/static/indicators.json'
#create_survey('survey.csv')
print '...success!'

print '\n\n'
print 'services.csv > app/assets/static/services.json'
#create_services('services.csv')
print '...success!'

print '\n\n'
#csv_path = 'raw/companies'
#company_files = [f for f in listdir(csv_path) if isfile(
    #join(csv_path,f)) and f[-3:] == 'csv']
#for f in company_files:
    #print '%s > app/assets/static/%s.json' % (f, f[:-4])
    #create_company(f)
print '...success!'
print '\n\n'

print '\n\n'
print 'services.json + indicators.json = indicator-scores.json'
#create_indicator_scores()
print '...success!'
print '\n\n'

print '\n\n'
print 'companies.json > app/assets/static/indicators/{indicators}.json'
create_indicators()
print '...success!'
print '\n\n'
