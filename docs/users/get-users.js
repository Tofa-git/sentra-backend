module.exports = {
    get:{
        tags: ['Users'],
        description: "Get users",
        operationId: 'getUsers',
        parameters:[],
        responses:{
            '200':{
                description:"Users were obtained",
                content:{
                    'application/json':{
                        schema:{
                            $ref:'#/components/schemas/Todo'
                        }
                    }
                }
            }
        }
    }
}