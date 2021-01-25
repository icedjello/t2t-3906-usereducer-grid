import {useReducer, useState} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise'

const initialRowData = [
    {id: 0, brand: {name: "Toyota", selected: false}, model: "Celica", price: {amount: 15000, style: null}},
    {id: 1, brand: {name: "Ford", selected: false}, model: "Mondeo", price: {amount: 32000, style: null}},
    {id: 2, brand: {name: "Porsche", selected: false}, model: "Boxter", price: {amount: 72000, style: null}},
    {id: 3, brand: {name: "Ford", selected: false}, model: "Mustang", price: {amount: 60000, style: null}},
    {id: 4, brand: {name: "Toyota", selected: false}, model: "Camry", price: {amount: 20000, style: null}},
    {id: 5, brand: {name: "Porsche", selected: false}, model: "Cayenne", price: {amount: 50000, style: null}},
    {id: 6, brand: {name: "Suzuki", selected: false}, model: "Swift", price: {amount: 10000, style: null}},
    {id: 7, brand: {name: "Suzuki", selected: false}, model: "Jimny", price: {amount: 20000, style: null}},
    {id: 8, brand: {name: "Toyota", selected: false}, model: "Prius", price: {amount: 18000, style: null}},
    {id: 9, brand: {name: "Ford", selected: false}, model: "Fiesta", price: {amount: 16000, style: null}},
    {id: 10, brand: {name: "Toyota", selected: false}, model: "Supra", price: {amount: 72000, style: null}},
    {id: 11, brand: {name: "Porsche", selected: false}, model: "Cayman", price: {amount: 88000, style: null}},
    {id: 12, brand: {name: "Porsche", selected: false}, model: "Spyder", price: {amount: 73000, style: null}},
]

const SELECTION = 'selection';
const LOW = 'low'
const MEDIUM = 'medium'
const HIGH = 'high'

const reducer = (state, action) => {
    const newState = [...state];
    switch (action.type) {
        case SELECTION:
            return newState.map(
                row => {
                    if (row.id === action.id) {
                        return {
                            ...row,
                            brand: {
                                ...row.brand,
                                selected: action.selected
                            }
                        }
                    }
                    return row;
                }
            );
        case LOW:
            return newState.map(
                row => {
                    const price = row.price.amount;
                    if (price < 20000) {
                        return {
                            ...row,
                            price: {
                                ...row.price,
                                style: LOW
                            }
                        }
                    }
                    return row;
                }
            );
        case MEDIUM:
            return newState.map(
                row => {
                    const price = row.price.amount;
                    if (price >= 20000 && price < 55000) {
                        return {
                            ...row,
                            price: {
                                ...row.price,
                                style: MEDIUM
                            }
                        }
                    }
                    return row;
                }
            );
        case HIGH:
            return newState.map(
                row => {
                    const price = row.price.amount;
                    if (price >= 55000) {
                        return {
                            ...row,
                            price: {
                                ...row.price,
                                style: HIGH
                            }
                        }
                    }
                    return row;
                }
            );
        default:
            console.warn('No matching reducer case.')
    }
}


export function Grid() {
    const [gridApi, setGridApi] = useState({});
    const [rowData, dispatch] = useReducer(reducer, initialRowData);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
    }

    const GRID_STYLES = {
        height: 600,
        width: 600,
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto'
    }

    const cellStyler = params => {
        switch (params.data.brand.selected) {
            case true:
                return {backgroundColor: 'lightblue'};
            default:
                return null;
        }
    }

    const priceClassRules = {
        'rag-green': function (params) {
            return params.data.price.style === LOW;
        },
        'rag-amber': function (params) {
            return params.data.price.style === MEDIUM;
        },
        'rag-red': function (params) {
            return params.data.price.style === HIGH;
        },
    }

    const priceValueGetter = (params) => {
        return params.data.price.amount
    }

    const makeValueGetter = (params) => {
        return params.data.brand.name
    }

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        setSelectedRowId(selectedRows[0].id)
    };

    const buttonSelectClickHandler = () => {
        if (!(selectedRowId == null)) {
            const action = {
                type: SELECTION,
                selected: true,
                id: selectedRowId
            }
            dispatch(action)
        }
    }

    const buttonHighlightHandler = (style) => {
        console.log('select', style)
        const action = {
            type: style,
        }
        dispatch(action)
    }

    return (
        <div>
            <span style={{display: "block"}}>
                <button onClick={() => buttonSelectClickHandler()}>Select</button>
            </span>
            <span>
                 <button onClick={() => buttonHighlightHandler(LOW)}>low</button>
                 <button onClick={() => buttonHighlightHandler(MEDIUM)}>medium</button>
                 <button onClick={() => buttonHighlightHandler(HIGH)}>high</button>
            </span>
            <div
                className="ag-theme-alpine"
                style={GRID_STYLES}>
                <AgGridReact
                    rowData={rowData}
                    rowSelection={'single'}
                    onGridReady={onGridReady}
                    onSelectionChanged={onSelectionChanged}

                >
                    <AgGridColumn
                        field="brand"
                        headerName="Make"
                        valueGetter={makeValueGetter}
                        cellStyle={params => cellStyler(params)}

                    />
                    <AgGridColumn field="model"/>
                    <AgGridColumn
                        field="multi"
                        headerName="Price"
                        valueGetter={priceValueGetter}
                        cellClassRules={priceClassRules}

                    />
                </AgGridReact>
            </div>
        </div>
    );
}
