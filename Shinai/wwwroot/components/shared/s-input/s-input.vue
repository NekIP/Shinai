<template>
	<span class="s-input">
		<span>
			<slot name="icon"></slot>
		</span>
		<input />
	</span>
</template>
<script>
	import EmailUtils from 'utils/email';

	class Format {
		constructor(
			name, 
			min = undefined, 
			max = undefined, 
			decimalPlaces = undefined) {
				
			this.name = name;
			this.min = min;
			this.max = max;
			this.decimalPlaces = decimalPlaces;
		}
	}

	class FormatParser {
		static parse(type) {
			let indexOfOpenBracket = type.indexOf('(');
			if (indexOfOpenBracket < 0) {
				return new Format(type);
			}
			if (!type.includes(')', indexOfOpenBracket)) {
				throw new Error('Input format error, there must be a closing bracket!');
			}
			let splitedFormat = type.split('(');
			let name = splitedFormat[0];
			let args = splitedFormat[1].replace(')', '').replace(' ', '').split(',');
			if (args.length > 3) {
				throw new Error('Exceeded number of arguments in format function!');
			}
			return new Format(name, +args[0], +args[1], +args[2]);
		}
	}

	class ValidationCreator {
		static create(format, translator) {
			let numberValidator = (val, frmt) =>
				frmt.min && frmt.max 
					? +val >= frmt.min && +val < frmt.max
					: frmt.min
						? +val >= frmt.min
						: frmt.max
							? +val < frmt.max
							: true;
			let numberValidators = [
				new Validator((val, frmt) => 
					frmt.min && frmt.max ? +val >= frmt.min && +val < frmt.max : true, 
					(frmt) => `The length of the string must be longer ${frmt.min} and shorter ${frmt.max}.`
				),
				
			]
			let stringValidator = (val, frmt) => 
				frmt.min && frmt.max 
					? ('' + val).length >= frmt.min && ('' + val).length < frmt.max
					: frmt.min
						? ('' + val).length >= frmt.min
						: frmt.max
							? ('' + val).length < frmt.max
							: true;
			let defaultValidator = (val, frmt) => true;
			switch (format.name) {
				case 'string': 
					return 
				case 'int': 
				case 'float': return [new Validator(numberValidator, '')]
				case 'date':
				case 'time':
				case 'datetime':
				case 'password': /* TODO: implement */
				case 'phone':	/* TODO: implement */
					return defaultValidator;
				case 'email':
					return (val, frmt) => EmailUtils.validate(val);
			}
		}
	}

	class Validator {
		constructor(validator, failedMessage) {
			this.validator = validator;
			this.failedMessage = failedMessage;
		}
	}

	export default {
		name: 'input',
		props: {
			value: {
				type: String | Number | Date | Object,
				required: true
			},
			type: {
				type: String,
				required: false,
				default: 'string'	
				/* 
					string, 
					string(1, 6) - max 6, min 1, 
					string(*, 6) - max 6,
					string(1, *) - min 1,
					int, 
					int(6, 8) - min 6, max 8,
					int(6, *) - min 6,
					int(*, 8) - max 8
					float, 
					float(2, 6, 3) - min 2, max 8, 3 decimal places,
					float(*, *, *)
					date, 
					time, 
					datetime,
					phone,
					email,
					password
				*/
			},
			validators: {
				type: Array,
				required: false,
				default: []
			}
		},
		data() {
			return {
				
			}
		},
		computed: {
			format() {
				return FormatParser.parse(this.type);
			},

			formatValidator() {
				return ValidationCreator.create(this.format);
			}
		},
		methods: {
			input(value) {
				
			}
		}
	}
</script>
<style lang="scss" scoped>

</style>
