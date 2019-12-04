import sys
import pandas as pd
import json
import numpy as np

def myfun(x):
    pass

def main(argv):
    country = argv[1].upper()
    vfile,catefile = 'youtube-new/{}videos.csv'.format(country),'youtube-new/{}_category_id.json'.format(country)
    video = pd.read_csv(vfile,encoding='ISO-8859-1')
    cate = pd.read_json(catefile, orient='records')
    catei = cate.loc[:,['items']]['items'].to_json(orient="records")
    cateijson = json.loads(catei)
    cateid2title = dict(map(lambda d: (int(d['id']),d['snippet']['title']),cateijson))

    # part of the data include category_id and tags
    vdata0 = video.iloc[:,:7]
    # vdata0['category'] = vdata0.iloc[:,4].apply(lambda x: cateid2title[x]).values
    # # print(vdata0.values) # matrix, each is a list

    # grpbycate = vdata0.groupby('category')
    # cateagg = grpbycate['video_id'].apply(lambda g: len(set(g.values)))
    
    # # show the top popular category in the country
    # print(cateagg.sort_values(ascending=False))

    grpbyvid = vdata0.groupby('video_id')
    mydf = grpbyvid.apply(lambda g: list(map(lambda s: s.strip('"').lower(),g.iloc[0,6].split('|'))))
    print(mydf.to_dict())



if __name__ == '__main__':
    main(sys.argv)
