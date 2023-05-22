const variables = {}
const operators = ['+', '-', '*', '/', '^']
const functions = ['sqrt', 'sin', 'cos', 'tan']
const constants = ['sqrt', 'sin', 'cos', 'tan', 'pi', 'e']

function appendText(text) {
    const input = document.getElementById('expressionInput')
    input.value += text
}

function addToHistory(expression, result) {
    const historyList = document.getElementById('historyList')
    const listItem = document.createElement('li')

    let buttonRemove = document.createElement('BUTTON');
    buttonRemove.textContent = 'Remove'

    buttonRemove.addEventListener("click", function () {
        historyList.removeChild(this.parentElement)
    });

    listItem.textContent = `${expression} = ${result.toFixed(4)}`
    listItem.onclick = () => {
        const input = document.getElementById('expressionInput')
        input.value = expression
    }
    listItem.appendChild(buttonRemove)
    historyList.appendChild(listItem)
}

function clearExpression() {
    const input = document.getElementById('expressionInput')
    const outputDisplay = document.getElementById('outputDisplay')
    input.value = ''
    outputDisplay.textContent = ''
}


function addVariables() {

    const inputKeyField = document.getElementById('variableKeyInput')
    const inputValueField = document.getElementById('variableValueInput')

    const variableErrorDisplay = document.getElementById('variableErrorOutputDisplay')

    const inputKey = inputKeyField.value.trim().replaceAll(' ', '')
    const inputValue = inputValueField.value.trim().replaceAll(' ', '')

    try {

        if (!inputKey || !inputValue) {
            throw new Error('Both Key and Value are required')
        }

        if (!checkVariableName(inputKey)) {
            throw new Error('Not valid Variable name')
        }

        if (variables[inputKey]) {
            throw new Error('Variable already exists')
        }

        if (constants.includes(inputKey)) {
            throw new Error('Invalid Variable')
        }

        if (isNaN(inputValue)) {
            throw new Error('Not valid value')
        }

        variables[inputKey] = inputValue
        const variableList = document.getElementById('variableList')
        const listItem = document.createElement('li')

        let buttonRemove = document.createElement('BUTTON');
        buttonRemove.textContent = 'Remove'

        buttonRemove.addEventListener("click", function () {
            delete variables[this.parentElement.textContent.split(' ')[0]]
            variableList.removeChild(this.parentElement)
        });

        listItem.textContent = `${inputKey} = ${inputValue}`
        listItem.appendChild(buttonRemove)
        variableList.appendChild(listItem)

        inputKeyField.textContent = ''
        inputValueField.textContent = ''

    } catch (error) {
        variableErrorDisplay.textContent = error.message
    }

}

function checkVariableName(text) {

    if (!(/[a-zA-Z]/).test(text[0]))
        return false

    if (!(/^[\w]+$/).test(text))
        return false

    return true

}


function evaluateExpression() {
    const input = document.getElementById('expressionInput')
    const outputDisplay = document.getElementById('outputDisplay')
    const expression = (input.value.trim()).replaceAll(' ', '')

    try {
        checkValidExpression((' ' + expression).slice(1))
        const result = evaluate(expression)
        outputDisplay.textContent = result.toFixed(4)
        addToHistory(expression, result)
    } catch (error) {
        outputDisplay.textContent = error.message
    }
}

function checkValidExpression(text) {
    if (checkParentheses(text)) {
        if (checkOperators(text.replaceAll('(', '').replaceAll(')', ''))) {
            if (checkConstants(text)) {
                if (checkFunctions(text)) {
                    return true
                }
                throw new Error('Invalid Function Usage')
            }
            throw new Error('Invalid Constants Usage')
        }
        throw new Error('Invalid Operator Usage')
    }
    throw new Error('Invalid Parentheses')
}


function evaluate(expression) {
    let result = null

    if (expression.includes('sqrt(')) {
        const start = expression.indexOf('sqrt(')
        const end = expression.indexOf(')', start)
        if (start >= 0 && end >= 0) {
            const subExpression = expression.substring(start + 5, end)
            const subResult = Math.sqrt(evaluate(subExpression))
            const newExpression = expression.replace(`sqrt(${subExpression})`, subResult)
            result = evaluate(newExpression)
        }
    } else if (expression.includes('sin(')) {
        const start = expression.indexOf('sin(')
        const end = expression.indexOf(')', start)
        if (start >= 0 && end >= 0) {
            const subExpression = expression.substring(start + 4, end)
            const subResult = Math.sin(evaluate(subExpression))
            const newExpression = expression.replace(`sin(${subExpression})`, subResult)
            result = evaluate(newExpression)
        }
    } else if (expression.includes('cos(')) {
        const start = expression.indexOf('cos(')
        const end = expression.indexOf(')', start)
        if (start >= 0 && end >= 0) {
            const subExpression = expression.substring(start + 4, end)
            const subResult = Math.cos(evaluate(subExpression))
            const newExpression = expression.replace(`cos(${subExpression})`, subResult)
            result = evaluate(newExpression)
        }
    } else if (expression.includes('tan(')) {
        const start = expression.indexOf('tan(')
        const end = expression.indexOf(')', start)
        if (start >= 0 && end >= 0) {
            const subExpression = expression.substring(start + 4, end)
            const subResult = Math.tan(evaluate(subExpression))
            const newExpression = expression.replace(`tan(${subExpression})`, subResult)
            result = evaluate(newExpression)
        }
    } else if (expression.includes('(')) {
        const start = expression.lastIndexOf('(')
        const end = expression.indexOf(')', start)
        if (start >= 0 && end >= 0) {
            const subExpression = expression.substring(start + 1, end)
            const subResult = evaluate(subExpression)
            const newExpression = expression.replace(`(${subExpression})`, subResult)
            result = evaluate(newExpression)
        }
    } else {
        result = evaluateSimpleExpression(expression)
    }

    return result
}

function evaluateSimpleExpression(expression) {
    let result = null

    if (expression.includes('+')) {
        const parts = expression.split('+')
        if (parts[0])
            result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result += evaluate(parts[i])
        }
    } else if (expression.includes('-')) {
        const parts = expression.split('-')
        if (parts[0])
            result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result -= evaluate(parts[i])
        }
    } else if (expression.includes('*')) {
        const parts = expression.split('*')
        if (parts[0])
            result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result *= evaluate(parts[i])
        }
    } else if (expression.includes('/')) {
        const parts = expression.split('/')
        if (parts[0])
            result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            const divisor = evaluate(parts[i])
            if (divisor === 0) {
                throw new Error('Cannot divide by zero')
            }
            result /= divisor
        }
    } else if (expression.includes('^')) {
        const parts = expression.split('^')
        result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result = Math.pow(result, evaluate(parts[i]))
        }
    } else if (expression in variables) {
        result = parseFloat(variables[expression])
    } else if (expression === 'pi') {
        result = Math.PI
    } else if (expression === 'e') {
        result = Math.E
    } else {

        result = parseFloat(expression)
        if (isNaN(result)) {
            throw new Error('Invalid expression')
        }
    }

    return result
}





function checkParentheses(text) {

    const parentheses = text.match(/[()]/g)
    if (parentheses) {

        if (parentheses.length % 2 !== 0) {
            return false
        }

        const stack = []

        for (let i = 0; i < parentheses.length; i++) {
            const parenthesis = parentheses[i]
            if (parenthesis === '(') {
                stack.push(parenthesis)
            } else {
                if (stack.length === 0) {
                    return false
                }
                stack.pop()
            }
        }
        if (stack.length !== 0) {
            return false
        }
    }
    return true
}

function checkOperators(text) {
    const invalidOperatorCombination = text.match(/[-+*/^]\s*[-+*/^]/g)
    if (invalidOperatorCombination) {
        return false
    }
    for (ops of operators) {
        if (text.lastIndexOf(ops) === text.length - 1) {
            return false
        }
    }
    return true
}



function checkConstants(text) {
    const constantNames = text.match(/^[a-zA-Z_][a-zA-Z0-9_]*/g)
    if (constantNames) {
        for (let i = 0; i < constantNames.length; i++) {
            const constantName = constantNames[i]
            if (!constants.includes(constantName) && !variables[constantName]) {
                return false
            }
        }
    }
    return true
}

function checkFunctions(text) {

    const functionNames = text.match(/[a-zA-Z_][a-zA-Z0-9_]*(?=\()/g)
    if (functionNames) {
        for (let i = 0; i < functionNames.length; i++) {
            const functionName = functionNames[i]
            if (!functions.includes(functionName)) {
                return false
            }
        }
    }
    return true
}