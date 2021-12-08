import moment from "moment";

import Status from "../model/status.model.js";

export const setStatuses = () => {
    const statuses = [
        {
            id: 0,
            name: 'Canceled'
        },
        {
            id: 1,
            name: 'In Production'
        },
        {
            id: 2,
            name: 'Planned'
        },
        {
            id: 3,
            name: 'Post Production'
        },
        {
            id: 4,
            name: 'Released'
        },
        {
            id: 5,
            name: 'Rumored'
        }
    ];

    statuses.map(async (s) => {
        const status = new Status({
            id: s.id,
            name: s.name,
            timestamp: moment().add(2, 'hours').format()
        });

        await status.save();
    })
}