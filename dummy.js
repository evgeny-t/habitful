
'use strict';

import moment from 'moment';
import _ from 'lodash';
import uuid from 'uuid';

const dummy = {
  openDrawer: false,
  birthday: null,
  today: moment('20160906', 'YYYYMMDD'),
  title: null,
  firstTime: true,
  habits: [
    {
      _id: 'bf792bf1-6031-439d-b492-08b5a8472e49',
      routine: 'monday routine',
      goal: 'test TODAY view',
      days: [false, true, false, false, false, false, false],
      tags: ['foo', 'bar'],
      history: [
        {
          when: moment('20130901', 'YYYYMMDD'),
        },
        {
          when: moment('20130801', 'YYYYMMDD'),
        },
      ],
    },
    {
      _id: '65b0a34c-9153-421f-9820-8b38fd2767cd',
      routine: 'tuesday routine',
      goal: 'test TODAY view',
      days: [false, false, true, false, false, false, false],
      tags: [],
      history: [
      ],
    },
    {
      _id: '6c13bac2-45cb-47f6-85bd-1078c59cd2c1',
      routine: 'wednesday routine',
      goal: 'test TODAY view',
      days: [false, false, false, true, false, false, false],
      tags: ['bar', 'health'],
      history: [
        { when: moment().set({ year: 2016, month: 7, date: 21 }) },
        { when: moment().set({ year: 2016, month: 8, date: 1 }) },
        { when: moment().set({ year: 2016, month: 8, date: 2 }) },
        { when: moment().set({ year: 2016, month: 8, date: 3 }) },
        { when: moment().set({ year: 2016, month: 8, date: 5 }) },
      ],
    },
    {
      _id: 'eedd6da7-bd65-4d32-92e9-d5cdf9919e87',
      routine: 'thursday routine',
      goal: 'test TODAY view',
      days: [false, false, false, false, true, false, false],
      history: [
      ],
    },
    {
      _id: 'c769a825-06f4-4b6b-a131-3b39611c3e10',
      routine: 'friday routine',
      goal: 'test TODAY view',
      days: [false, false, false, false, false, true, false],
      history: [
      ],
    },
    {
      _id: '699b68d4-0bee-453f-b913-8a9b3344d604',
      routine: 'Running',
      goal: 'it will help me to be more healty',
      days: [false, true, true, true, true, true, true],
      tags: [
        'some fancy long tag', 'i love running running', 'foo', 'bar', 'az',
        'qweq', 'wer', 'ert', 'tyu',
      ],
      history: [
      ],
    },

    {
      _id: '15a9d418-7b94-4da9-a197-c89799e6943e',
      routine: 'Writing Writing Writing Writing Writing Writing Writing Writing',
      goal: 'it will help me to obtain the voice ;)',
      days: [false, true, true, true, true, true, true],
      history: [
      ],
    },

    {
      _id: '061c28bf-28b5-4d9e-bd43-b42f3ede7038',
      routine: 'Push-ups',
      goal: 'it will help me to be more muscled',
      days: [false, true, true, true, true, true, true],
      history: [
        {
          when: moment('19900902', 'YYYYMMDD'),
        },
        ...(_.range(1, 10).map(i => {
          return {
            when: moment().set({ year: 2015, month: 7, date: i }),
          };
        })),
      ],
    },
  ],

  lifetime: {
    modified: 0,
  },

  library: {
    items: [
      {
        _id: '1',
        name: 'foo',
        description: 'foo description. see http://foo.bar/topic',
        url: 'http://learn.more',
        image: 'http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg',
        tags: ['foo', 'bar', 'baz'],
      },

      {
        _id: '2',
        name: 'baz bar',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: 'http://google.com',
        image: 'http://www.material-ui.com/images/grid-list/morning-819362_640.jpg',
        tags: ['foo'],
      },

      {
        _id: '3',
        name: 'Eat sandwiches',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/burger-827309_640.jpg',
      },

      {
        _id: '4',
        name: 'Take photofs',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
        tags: ['baz'],
      },

      {
        _id: '5',
        name: 'Take photos 2',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
      },

      {
        _id: '6',
        name: 'Take photos 22',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
      },

      {
        _id: '7',
        name: 'foo 1',
        description: 'foo description. see http://foo.bar/topic',
        url: 'http://learn.more',
        image: 'http://www.material-ui.com/images/grid-list/00-52-29-429_640.jpg',
      },

      {
        _id: '8',
        name: 'baz bar 2',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: 'http://google.com',
        image: 'http://www.material-ui.com/images/grid-list/morning-819362_640.jpg',
      },

      {
        _id: '9',
        name: 'Eat sandwiches 3',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/burger-827309_640.jpg',
      },

      {
        _id: '10',
        name: 'Take photos 4',
        description: 'des cription of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
      },

      {
        _id: '11',
        name: 'Take photos 2 5',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
      },

      {
        _id: '12',
        name: 'Take photos 22 6',
        description: 'description of the foo description. see http://foo.bar/topic',
        url: '',
        image: 'http://www.material-ui.com/images/grid-list/camera-813814_640.jpg',
      },
    ],
    popularity: {
      '3': 123,
      '6': 2,
      '11': 7877,
    },
  }
};

export default dummy;
