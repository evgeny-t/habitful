import Shepherd from 'tether-shepherd';

export default function createTour(store, actions) {
  let tour = new Shepherd.Tour({
    defaults: {
      classes: 'shepherd-theme-arrows'
    }
  });

  tour.addStep('Add habit', {
    title: 'Add Habit',
    text: 'Hi. You may start from adding a new habit...',
    attachTo: '#my-habits__add-button left',
  });

  tour.addStep('Add Habit', {
    title: 'Explore library',
    text: '...or start from exploring the habits library.',
    attachTo: '#drawer__menu__library right',
    beforeShowPromise: () => new Promise(resolve => {
      store.dispatch(actions.openDrawer());
      setTimeout(resolve, 500);
    }),
  });

  // tour.addStep('Routines', {
  //   title: 'Complete daily routines',
  //   text: 'Make sure you have completed all your daily routines.',
  //   attachTo: '#drawer__menu__today right',
  // });

  tour.addStep('Overview', {
    title: 'Progress in life perspective',
    text: 'Find a minute to take a look at your progress in life perspective once a week.',
    attachTo: '#drawer__menu__overview right',
    buttons: [{
      text: 'Close',
      action: tour.complete,
    }],
  });

  tour.on('complete', () => {
    store.dispatch(actions.completeTour());
  });

  return tour;
}
