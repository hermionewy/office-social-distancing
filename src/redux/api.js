import moment from 'moment';
import { range } from 'd3-array';
import { DATE_TIME_FORMAT } from '../constant';
import { moveToPointAtLength } from '../utils';

const NUM_PEOPLE = 15;
const TIME_PERIODS = 20;
export const getData = node => {
  return new Promise((resolve, reject) => {
    const userMap = new Map();
    const delta = node.getTotalLength() / NUM_PEOPLE;
    return resolve(
      [].concat.apply(
        [],
        range(TIME_PERIODS).map(i => {
          return range(NUM_PEOPLE).map(user => {
            let x,
              y,
              l,
              reverse = false;
            if (!i) {
              l = Math.ceil(delta * user);
              [x, y] = moveToPointAtLength(node, l);
              userMap.set(user, { l, reverse });
            } else {
              const u = userMap.get(user);
              l = u.l;
              reverse = u.reverse;
              l = reverse ? Math.ceil(l - delta) : Math.ceil(delta + l);
              if (l > node.getTotalLength()) {
                reverse = true;
                l -= delta;
              } else if (l < 0) {
                reverse = false;
                l = 0;
              }
              [x, y] = moveToPointAtLength(node, l);
              userMap.set(user, { l, reverse });
            }
            return {
              dt: moment()
                .startOf('day')
                .add(1 * i, 'minute')
                .format(DATE_TIME_FORMAT),
              id: `individual-${user}`,
              location: {
                x,
                y,
              },
            };
          });
        }),
      ),
    );
  });
};
