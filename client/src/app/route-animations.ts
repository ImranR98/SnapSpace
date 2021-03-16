import { trigger, transition, style, animate, query, group, animateChild, } from '@angular/animations';
export const fader =
    trigger('routeAnimations', [
        transition('* <=> *', [
            style({ opacity: 0 }),
            animate('600ms ease', style({ opacity: 1 }))
        ]),
    ]);