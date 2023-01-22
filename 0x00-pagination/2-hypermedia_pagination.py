#!/usr/bin/env python3
''' Hypermedia Pagination '''
import csv
import math
from typing import List, Tuple, Dict


def index_range(page: int, page_size: int) -> Tuple:
    '''
        function should return a tuple of size two
        containing a start index and an end index
        corresponding to the range of indexes to return
        in a list for those particular pagination parameters
    '''
    start_index = page * page_size - page_size
    stop_index = page * page_size
    return (start_index, stop_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        '''
            paginate pages
        '''
        assert type(page) is int and page > 0
        assert type(page_size) is int and page_size > 0

        indexes = index_range(page, page_size)

        try:
            dataset = self.dataset()
            return dataset[indexes[0]: indexes[1]]
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        '''
            method that takes the same arguments (and defaults)
            as get_page and returns a dictionary
        '''
        data = self.get_page(page, page_size)
        total_pages = math.ceil(len(self.dataset()) / page_size)
        next_page = page + 1 if total_pages > page else None
        prev_page = page - 1 if page > 1 else None
        return {
            'page_size': len(data),
            'page': page,
            'data': data,
            'next_page': next_page,
            'prev_page': prev_page,
            'total_pages': total_pages
        }
