const getTagID = async(tagName, spiritID) => {
    try {

        const payload = {
            _spirit: spiritID,
            defaultTimezone: "America/Buenos_Aires",
            objectId: 2215439,
        }
        console.debug('Getting tag ID', payload)
        const response = await fetch('https://app.connecteam.com/api/UserDashboard/PunchClock/Data/', {
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(payload),
            "method": "POST",
        }).then(res => res.json())
        const tag = response.data.availableTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase())
        if (!tag) throw new Error('Tag not found')
        return tag.id
    } catch (e) {
        console.log(e)
        return 0
    }
}



const createRequest = async(startDate, tagID, spiritID) => {

    try {
        if (tagID === 0) throw new Error('Tag not found')
        const payload = {
            punchInTime: startDate,
            punchOutTime: startDate + 8 * 60 * 60,
            objectId: 2215439,
            timezone: "America/Buenos_Aires",
            tagHierarchy: [tagID],
            shiftAttachments: [{
                    "id": "65cbb88e-6c3a-41b1-8822-975caed50def",
                    "type": "freeText",
                    "freeText": ""
                },
                {
                    "id": "8c013420-5071-4803-b1b5-1920dfbc6018",
                    "type": "dropdownList",
                    "itemId": ""
                },
                {
                    "id": "68de5de0-db73-401f-8fad-3376560e5a8f",
                    "type": "number",
                    "number": null
                }
            ],
            "note": "",
            "approvalNote": "",
            _spirit: spiritID
        }

        fetch('https://app.connecteam.com/api/UserDashboard/PunchClock/ShiftRequest/', {
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(payload),
            "method": "POST",
        })
    } catch (e) {
        console.log(e)
    }
}

const getDaysOfMonth = (year, month) => {
    const days = []
    const date = new Date(year, month - 1, 1, 9)
    while (date.getMonth() === month - 1) {
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            days.push(date.getTime() / 1000)
        }
        date.setDate(date.getDate() + 1)
    }
    return days
}

const generateMonthlyRequests = async(projectName, year, month, daysExcluded = []) => {
    try {
        const cookies = document.cookie.split(';').map(c => c.trim().split('=')).reduce((a, [k, v]) => ({...a, [k]: v }), {})
        if (!cookies['_spirit']) throw new Error('Spirit not found')

        const excludedTimestamps = daysExcluded.map(d => new Date(year, month - 1, d, 9).getTime() / 1000)
        const timestamps = getDaysOfMonth(year, month)

        const tagID = await getTagID(projectName, cookies['_spirit'])
        if (tagID === 0) throw new Error('Tag not found')

        for (const timestamp of timestamps) {
            if (!excludedTimestamps.includes(timestamp)) await createRequest(timestamp, tagID, cookies['_spirit'])
        }
    } catch (e) {
        console.log(e)
    }
}

const generateDailyRequests = async(projectName, year, month, day) => {
    try {
        const cookies = document.cookie.split(';').map(c => c.trim().split('=')).reduce((a, [k, v]) => ({...a, [k]: v }), {})
        if (!cookies['_spirit']) throw new Error('Spirit not found')
        const spiritID = cookies['_spirit']

        const timestamp = new Date(year, month - 1, day, 9).getTime() / 1000

        const tagID = await getTagID(projectName, spiritID)
        if (tagID === 0) throw new Error('Tag not found')
        await createRequest(timestamp, tagID, spiritID)
    } catch (e) {
        console.log(e)
    }
}