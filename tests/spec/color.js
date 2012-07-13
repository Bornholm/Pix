require(['core/color'], function( Color ) {

	describe('Color', function() {

		var color;

		beforeEach( function() {
			color = new Color();
		});

		it("should be defined", function() {
			expect(color).toBeDefined();
		});

		it("should be equal to itself", function() {
			expect(color).toEqual(color);
		});

		it("should clone itself", function() {
			expect(color).toEqual( new Color( color ) );
		});

		it(" rgb(201,34,37) should equal hsl(359,71%,46%) when threshold = 0.01", function() {
			var otherColor = new Color('rgb(201,34,37)');
			color = new Color( 'hsl(359,71%,46%)' );
			expect( color.equals( otherColor, 0.01 ) ).toBe(true);
		});


		describe('toRGBString()', function() {

			it("should return rgba(0,0,0,1) when passed true", function() {
				expect(color.toRGBString(true)).toEqual('rgba(0,0,0,1)');
			});

			it("should return rgb(0,0,0) when nothing passed", function() {
				expect(color.toRGBString()).toEqual('rgb(0,0,0)');
			});

			it("should return rgb(0,0,0) when passed false", function() {
				expect( color.toRGBString(false)).toEqual('rgb(0,0,0)');
			});

			it("should return rgba(245,127,0,0.1) when created with rgba(245,127,0,0.1)", function() {
				var rgbaString = 'rgba(245,127,0,0.1)';
				color = new Color( rgbaString );
				expect( color.toRGBString(true) ).toEqual(rgbaString);
			});

			it("should return rgb(245,127,0) when created with rgb(245,127,0)", function() {
				var rgbString = 'rgb(245,127,0)';
				color = new Color( rgbString );
				expect( color.toRGBString(false) ).toEqual(rgbString);
			});

		});

		describe('toHSLString()', function() {

			it("should return hsla(0,0%,0%,1) when passed true", function() {
				expect(color.toHSLString(true)).toEqual('hsla(0,0%,0%,1)');
			});

			it("should return hsl(0,0%,0%) when nothing passed", function() {
				expect(color.toHSLString()).toEqual('hsl(0,0%,0%)');
			});

			it("should return hsl(0,0%,0%) when passed false", function() {
				expect( color.toHSLString(false)).toEqual('hsl(0,0%,0%)');
			});

		});

		



	});

});