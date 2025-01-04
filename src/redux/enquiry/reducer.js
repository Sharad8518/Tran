import { SET_DETAILS, SET_PICK_AND_DROP, SET_TRANS_BID_ENQ_IDS } from "./types"

const initialState = {
    newEnquiry: {
        selectedConsignee: null,
        pickupAddress: null,
        weight: "",
        truckType: "",
        material: "",
        unloadingExpense: "",
        loadingExpense: "",
        loadingTime: "",
        advance: "",
        againstBill: "",
        remarks: ""
    },
    transporterBidEnquiryIds: []
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_PICK_AND_DROP:
            return {
                ...state,
                newEnquiry: {
                    ...state.newEnquiry,
                    selectedConsignee: payload.consignee,
                    pickupAddress: payload.pickupAddress
                }
            }
        case SET_DETAILS:
            return {
                ...state,
                newEnquiry: {
                    ...state.newEnquiry,
                    ...payload
                }
            }
        case SET_TRANS_BID_ENQ_IDS:
            return {
                ...state,
                transporterBidEnquiryIds: payload
            }
        default:
            return { ...state }
    }
}