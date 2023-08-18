/* import package [start] */
import Joi from 'joi';
/* import package [end] */

/* import custom dependency [start] */
import { PAGINATION } from '../../constants';
/* import custom dependency [end] */

/*validation Schema for pagination */
const paginationSchema = Joi.object({
    page: Joi.number().default(1),
    size: Joi.number().default(PAGINATION.ITEM_PER_PAGE),
});

export { paginationSchema };
