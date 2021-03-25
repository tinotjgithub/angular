export class UtilFunctions {
    static checkObjectHasProperty(obj: Object, key: string) {
        return obj ? obj.hasOwnProperty(key) : false; 
    }

    static processWorkCatgoryResp(resp = {}) {
        const keyArray = Object.keys(resp);
        const processed = keyArray.filter(e => (e !== 'total')).map(key => {
            return {
                name: key,
                value: resp[key]
            }
        });
        return processed;
    }
}