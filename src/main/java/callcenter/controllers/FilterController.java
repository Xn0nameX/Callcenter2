package callcenter.controllers;


import callcenter.Service.CallServiceFilter;
import callcenter.models.CallLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reports")
public class FilterController {

    private  final CallServiceFilter callServiceFilter;

    @Autowired
    public FilterController(CallServiceFilter callServiceFilter) {
        this.callServiceFilter = callServiceFilter;
    }

    @GetMapping("/filter")
    public ResponseEntity<List<CallLog>> getFilteredCalls(
            @RequestParam(value = "scenario", required = false) String scenario,
            @RequestParam(value = "callResult", required = false) String callResult,
            @RequestParam(value = "family", required = false) String family,
            @RequestParam(value = "tag", required = false) String tag
    ) {
        List<CallLog> filteredCalls = callServiceFilter.filterCall(scenario, callResult, family, tag);
        return ResponseEntity.ok(filteredCalls);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countFilteredCalls(
            @RequestParam(value = "scenario", required = false) String scenario,
            @RequestParam(value = "callResult", required = false) String callResult,
            @RequestParam(value = "family", required = false) String family,
            @RequestParam(value = "tag", required = false) String tag
    ) {
        int count = callServiceFilter.countFilteredCalls(scenario, callResult, family, tag);
        return ResponseEntity.ok(count);
    }

}
