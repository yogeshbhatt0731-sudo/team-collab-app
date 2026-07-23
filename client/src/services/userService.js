import axios from "axios";
import {config} from "./config.js"

// Same X-User-Id stand-in we send everywhere until real JWT login is wired.
const headers = {'X-User-Id':100}

// USERS api calls  ->  these hit the AUTH service, NOT the workspace service.
//
// Why a whole separate call?  The workspace DB only stores a bare userId (like 101)
// on assignees and comments — no name, no email, no avatar. That info lives in the
// Auth service DB. So to show "Rohit Kumar" instead of "101" we hand Auth a list of
// ids and it hands back the matching user profiles. This is the cross-service lookup.

// ids = [100, 101, 102]   ->   [{ id, name, email, avatarColor }]
export async function getUsersByIds(ids){
    // nothing to look up -> don't even bother calling
    if(!ids || ids.length === 0) return []
    try{
        // send the ids as one comma string:  /auth/users?ids=100,101,102
        const response = await axios.get(config.AUTH_BASE_URL+'/auth/users',{headers, params:{ids: ids.join(',')}})
        return response.data
    }
    catch(err){
        // Auth service isn't built yet, so failing here is EXPECTED for now.
        // We don't toast (it would pop an error every time a task opens) — the page
        // just falls back to the local MEMBERS mock for names.
        // WIRE: once Auth is up this returns real users and the fallback stops being used.
        console.warn('getUsersByIds failed (auth not ready?):', err.message)
        return []
    }
}
