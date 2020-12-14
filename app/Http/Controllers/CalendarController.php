<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\calendar;
use App\Traits\DateTime\DateTime;
	
class CalendarController extends Controller
{	
	public function show()
    {
        $dateFrom = date_format(date_create('2020-01-31'), "Y-m-d");
        $dateTo = date_format(date_create('2020-03-31'), "Y-m-d");

        return ["From" => $dateFrom,
                "To" => $dateTo];
    }

    public function store(Request $request)
    {
        $request->validate([
            'Event' => 'required',
            'DateFrom' => 'required',
            'DateTo' => 'required',
            'Day' => 'required'
        ]);
		
		//Check if Valid Dates
		$dateVFrom = date_parse_from_format('Y-m-d', $request->DateFrom);
		$dateVTo = date_parse_from_format('Y-m-d', $request->DateTo);
		
        if(empty($dateVFrom['year']) || empty($dateVFrom['month']) || empty($dateVFrom['day']))  {
            $response=array('status'=>'error','errors'=>'Invalid "Date From" input.');  
            return response()->json($response);
        }

        if(empty($dateVTo['year']) || empty($dateVTo['month']) || empty($dateVTo['day'])) {
            $response=array('status'=>'error','errors'=>'Invalid "Date To" input.');  
            return response()->json($response);
        }
		
        $dateFrom = date_create($request->DateFrom);
        $dateTo = date_create($request->DateTo);
		
		//Check if Date From less than equal to Date To
		if ($dateFrom > $dateTo){
			$response=array('status'=>'error','errors'=>'"Date From" is greater than "Date To"');  
            return response()->json($response);
		}
        
		$days = $request->Day;
		
        calendar::truncate();
        while ($dateFrom <= $dateTo) {
			$dateInt = strtotime(date_format($dateFrom,"Y-m-d"));
            $day = date('D', $dateInt);
            if(in_array($day, $days))
                $allData = [ 'event' => $request->Event,
                'dates' => $dateFrom];
            else
                $allData = ['dates' => $dateFrom];
			
			calendar::create($allData);
            date_add($dateFrom, date_interval_create_from_date_string("1 day"));
        }

        return calendar::all();
    }
}