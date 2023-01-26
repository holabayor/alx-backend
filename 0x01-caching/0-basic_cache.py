#!/usr/bin/env python3
'''
Basic Dictionary
'''
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    '''
        A Basic Cache System
    '''

    def put(self, key, item):
        '''
            Method to assign to the dictionary self.cache_data
            the item value for the key key
        '''
        self.cache_data[key] = item

    def get(self, key):
        '''
            Method to return the value in self.cache_data linked to key
        '''
        return self.cache_data.get(key, None)
