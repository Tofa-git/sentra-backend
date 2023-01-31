
module.exports = {
    post:{
        tags:['Users'],
        description: "Create todo",
        operationId: "createTodo",
        parameters:[],
        requestBody: {
            content:{
                'application/json': {
                    schema:{
                        $ref:'#/components/schemas/UserInput'
                    }
                }
            }
        },
        responses:{
            '201':{
                description: "Users created successfully"
            },
            '500':{
                description: 'Server error'
            }
        }
    }
}