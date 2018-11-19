var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { mapState } from 'vuex';
export default {
    data: function () {
        return {
            headerItems: {
                'performanceReporting': {
                    name: 'Performance Reporting',
                    type: 'group',
                    children: [
                        {
                            name: 'Sales Reporting',
                            type: 'group',
                            children: [
                                {
                                    name: 'Transaction Summary',
                                    url: '#'
                                },
                                {
                                    name: 'Transaction Detail Report',
                                    url: '#'
                                },
                                {
                                    name: 'Approval Rates',
                                    url: '#'
                                },
                                {
                                    name: 'Sales by Country',
                                    url: '#'
                                }
                            ]
                        },
                        {
                            name: 'Declined Transactions',
                            url: '#',
                            current: true
                        },
                        {
                            name: 'Member Reports',
                            type: 'group',
                            children: [
                                {
                                    name: 'Scheduled Rebills',
                                    url: '#'
                                },
                                {
                                    name: 'Active Members',
                                    url: '#'
                                }
                            ]
                        },
                        {
                            name: 'Conversions',
                            url: '#'
                        }
                    ]
                },
                'myWebsites': {
                    name: 'My Websites',
                    type: 'group',
                    children: [
                        {
                            name: 'Websites',
                            url: '#'
                        },
                        {
                            name: 'Price Points',
                            url: '#'
                        },
                        {
                            name: 'Country Block',
                            url: '#'
                        },
                        {
                            name: 'Postbacks',
                            url: '#'
                        },
                        {
                            name: 'Packages',
                            type: 'group',
                            children: [
                                {
                                    name: 'Manage Packages',
                                    url: '#'
                                },
                                {
                                    name: 'NATS Config',
                                    url: '#'
                                }
                            ]
                        },
                        {
                            name: 'Retention Offers',
                            type: 'group',
                            children: [
                                {
                                    name: 'Retention Offers Report',
                                    url: '#'
                                },
                                {
                                    name: 'Retention Offers Report',
                                    url: '#'
                                },
                                {
                                    name: 'Reactivation',
                                    url: '#'
                                }
                            ]
                        }
                    ]
                },
                'financialDetails': {
                    name: 'Financial Details',
                    type: 'group',
                    children: [
                        {
                            name: 'Payout Configuration',
                            url: '#'
                        },
                        {
                            name: 'Chargeback Report',
                            url: '#'
                        },
                        {
                            name: 'Invoice Report',
                            url: '#'
                        },
                        {
                            name: 'Payout Reporting',
                            type: 'group',
                            children: [
                                {
                                    name: 'Detail Ledger Report',
                                    url: '#'
                                },
                                {
                                    name: 'Daily Revenue Report',
                                    url: '#'
                                },
                                {
                                    name: 'Statement Report',
                                    url: '#'
                                },
                                {
                                    name: 'Payout Balance Report',
                                    url: '#'
                                }
                            ]
                        },
                        {
                            name: 'Reserves Report',
                            url: '#'
                        }
                    ]
                },
                'myConsumers': {
                    name: 'My Consumers',
                    type: 'group',
                    children: [
                        {
                            name: 'Refund Void Reasons',
                            url: '#'
                        },
                        {
                            name: 'Manage Consumers',
                            url: '#'
                        },
                        {
                            name: 'Recent Cancel/Expire',
                            url: '#'
                        },
                        {
                            name: 'Custom Cancel Reasons',
                            url: '#'
                        }
                    ]
                }
            }
        };
    },
    computed: __assign({}, mapState({
        styleClass: function (state) { return state.base.styleClass; }
    }))
};
