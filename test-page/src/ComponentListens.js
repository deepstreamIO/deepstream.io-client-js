export default {
    data: {
        listening: {
            members: [],
            intervalsIds: []
        }
    },

    methods: {
        saveListeningMember: function (member) {
            const listening = this.$data.listening
            
            if (listening.members.indexOf(member) === -1) {
                listening.members.push(member)
                return true
            }
            return false
        },
        
        removeListeningMember: function (member) {
            const listening = this.$data.listening
            const index = listening.members.indexOf(member)

            if (index > -1) {
                listening.members.splice(index, 1)
                return true
            }

            return false
        }
    }
}