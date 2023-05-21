

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
    console.log(result)
    listItem.textContent = `${expression} = ${result.toFixed(4)}`
    listItem.onclick = () => {
        const input = document.getElementById('expressionInput')
        input.value = expression
    }
    historyList.appendChild(listItem)
}

function clearExpression() {
    const input = document.getElementById('expressionInput')
    const outputDisplay = document.getElementById('outputDisplay')
    input.value = ''
    outputDisplay.textContent = ''
}


// function addConstants(text) {
//     for (const func of trigonometricFunctions) {
//         if (str.includes(func)) {
//             return false
//         }
//     }
//     constants.push(text)
//     return true
// }


function evaluateExpression() {
    const input = document.getElementById('expressionInput')
    const outputDisplay = document.getElementById('outputDisplay')
    const expression = input.value.trim()

    try {
        checkValidExpression((' ' + expression).slice(1))
        const result = evaluate(expression)
        console.log(result)
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
    console.log(expression)
    console.log(typeof (expression))

    if (expression.includes('sqrt(')) {
        console.log('sqrt')
        const start = expression.indexOf('sqrt(')
        const end = expression.indexOf(')', start)
        if (start >= 0 && end >= 0) {
            const subExpression = expression.substring(start + 5, end)
            console.log(subExpression, 'sub')
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
        console.log(1)
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
        result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result += evaluate(parts[i])
        }
    } else if (expression.includes('-')) {
        const parts = expression.split('-')
        result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result -= evaluate(parts[i])
        }
    } else if (expression.includes('*')) {
        const parts = expression.split('*')
        result = evaluate(parts[0])
        for (let i = 1; i < parts.length; i++) {
            result *= evaluate(parts[i])
        }
    } else if (expression.includes('/')) {
        const parts = expression.split('/')
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
        console.log(constants)
        result = variables[expression]
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
    console.log(constantNames)
    if (constantNames) {
        for (let i = 0; i < constantNames.length; i++) {
            const constantName = constantNames[i]
            if (!constants.includes(constantName)) {
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