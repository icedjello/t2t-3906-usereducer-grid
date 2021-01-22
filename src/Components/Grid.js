import {useReducer, useState} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise'

const initialRowData = [
    {id: 0, make: "Toyota", model: "Celica", multi: {price: 15000, style: null}},
    {id: 1, make: "Ford", model: "Mondeo", multi: {price: 32000, style: null}},
    {id: 2, make: "Porsche", model: "Boxter", multi: {price: 72000, style: null}}
]

const LOW = 'low'
const MEDIUM = 'medium'
const HIGH = 'high'

const reducer = (state, action) => {
    console.log(action.style)
    console.log(action.id)
    const newState = [...state];

    return newState.map(
        it => {
            if (it.id === action.id) {
                return {
                    ...it,
                    multi: {
                        ...it.multi,
                        style: action.style
                    }
                }
            }
            return it;
        }
    );

}


export function Grid() {
    const [gridApi, setGridApi] = useState({});
    const [rowData, dispatch] = useReducer(reducer, initialRowData);
    const [selectedRowId, setSelectedRowId] = useState(null);

    const onGridReady = (params) => {
        setGridApi(params.api);
    }

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

    const onSelectionChanged = () => {
        const selectedRows = gridApi.getSelectedRows();
        setSelectedRowId(selectedRows[0].id)
    };

    const buttonClickHandler = (style) => {
        if (!(selectedRowId == null)) {
            const action = {
                style: style,
                id: selectedRowId
            }
            dispatch(action)
        }
    }


    return (
        <div>
            <span>
                <button onClick={() => buttonClickHandler(LOW)}>low</button>
                <button onClick={() => buttonClickHandler(MEDIUM)}>medium</button>
                <button onClick={() => buttonClickHandler(HIGH)}>high</button>
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
