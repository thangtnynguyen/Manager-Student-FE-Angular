import { trigger, state, style, animate, transition } from '@angular/animations';

const animationConstant = {
    animations: [
        trigger('fadeInOut', [
            state('hidden', style({
              opacity: 0,
              height: '0',
              display: 'none'
            })),
            state('visible', style({
              opacity: 1,
              height: '100%',
              display: 'flex'
            })),
            transition('hidden => visible', animate('300ms ease-out')),
            transition('visible => hidden', animate('300ms ease-in'))
        ]),
    ],
};

export default animationConstant;



