#!/usr/bin/env python3
'''FIFO Dictionary'''
from collections import deque
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    '''
        A FIFO Cache System
    '''
    def __init__(self):
        super().__init__()
        self.queue = deque([])

    def put(self, key, item):
        '''
            Method to assign to the dictionary self.cache_data
            the item value for the key key
        '''
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS\
                    and key not in self.queue:
                discard_key = self.queue.popleft()
                del self.cache_data[discard_key]
                print('DISCARD: {}'.format(discard_key))
            self.cache_data[key] = item
            self.queue.append(key)

    def get(self, key):
        '''
            Method to return the value in self.cache_data linked to key
        '''
        return self.cache_data.get(key, None)
