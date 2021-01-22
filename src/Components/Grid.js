import {useReducer} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const initialRowData = [
    {make: "Toyota", model: "Celica", multi: {price: 15000, style: null}},
    {make: "Ford", model: "Mondeo", multi: {price: 32000, style: null}},
    {make: "Porsche", model: "Boxter", multi: {price: 72000, style: null}}
]

const LOW = 'low'
const MEDIUM = 'medium'
const HIGH = 'high'

const reducer = (state, action) => {
    console.log(action.type)
    const newState = [...state];

    switch (action.type) {
        case LOW:
            return newState.map(
                it => {
                    if (it.multi.price < 20000) {
                        return {
                            ...it,
                            multi: {
                                ...it.multi,
                                style: 'low'
                            }
                        }
                    }
                    return it;
                }
            );
        case MEDIUM:
            return newState.map(
                it => {
                    if (20000 <= it.multi.price && it.multi.price < 40000) {
                        return {
                            ...it,
                            multi: {
                                ...it.multi,
                                style: 'medium'
                            }
                        }
                    }
                    return it;
                }
            );
        case HIGH:
            return newState.map(
                it => {
                    if (it.multi.price > 40000) {
                        return {
                            ...it,
                            multi: {
                                ...it.multi,
                                style: 'high'
                            }
                        }
                    }
                    return it;
                }
            );
        default:
            throw new Error(`default hit ${action.type}`);
    }
}


export function Grid() {
    const [rowData, dispatch] = useReducer(reducer, initialRowData);

    const GRID_STYLES = {
        height: 200,
        width: 600,
        marginTop: 5,
        marginLeft: 'auto',
        marginRight: 'auto'
    }

    const cellStyler = params => {
        switch (params.data.multi.style) {
            case LOW:
                return {backgroundColor: 'green'};
            case MEDIUM:
                return {backgroundColor: 'yellow'};
            case HIGH:
                return {backgroundColor: 'red'};
            default:
                return null;
        }
    }

    const priceValueGetter = (params) => {
        return params.data.multi.price
    }

    return (
        <div>
            <span>
                <button onClick={() => dispatch({type: LOW})}>low</button>
                <button onClick={() => dispatch({type: MEDIUM})}>medium</button>
                <button onClick={() => dispatch({type: HIGH})}>high</button>
            </span>
            <div
                className="ag-theme-alpine"
                style={GRID_STYLES}>
                <AgGridReact
                    rowData={rowData}>
                    <AgGridColumn field="make"/>
                    <AgGridColumn field="model"/>
                    <AgGridColumn
                        field="multi"
                        headerName="Price"
                        valueGetter={priceValueGetter}
                        cellStyle={params => cellStyler(params)}
                    />
                </AgGridReact>
            </div>
        </div>
    );
}
