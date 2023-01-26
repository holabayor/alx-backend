#!/usr/bin/env python3
'''LFU Cache'''
from collections import OrderedDict, deque
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    '''
        A LFU Cache System
    '''
    def __init__(self):
        '''
            Initializes
        '''
        super().__init__()
        self.keys = deque([])

    def put(self, key, item):
        '''
            Method to assign to the dictionary self.cache_data
            the item value for the key key
        '''
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS\
                    and key not in self.keys:
                discard_key = self.keys.popleft()
                del self.cache_data[discard_key]
                print('DISCARD: {}'.format(discard_key))
            if key in self.keys:
                self.keys.remove(key)
            self.cache_data[key] = item
            self.keys.append(key)

    def get(self, key):
        '''
            Method to return the value in self.cache_data linked to key
        '''
        if key in self.keys:
            self.keys.remove(key)
            self.keys.append(key)
        return self.cache_data.get(key, None)
